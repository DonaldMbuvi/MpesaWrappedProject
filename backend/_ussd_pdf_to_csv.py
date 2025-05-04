from fastapi import HTTPException
import re
import PyPDF2
import camelot
import pandas as pd
import warnings
import time
import os
from multiprocessing import Pool
from functools import partial
import multiprocessing
from io import BytesIO, StringIO
from _ussd_reading_csv import csv_cleaner

# Set global options for better performance
os.environ['OMP_NUM_THREADS'] = '1'  # Avoid numpy threading conflicts
os.environ['MKL_NUM_THREADS'] = '1'  # Avoid Intel MKL threading conflicts

def decrypt_pdf_bytes(pdf_bytes: bytes, password: str) -> bytes | None:
    """Decrypt PDF bytes and return decrypted PDF bytes."""
    if not password:
        raise HTTPException(status_code=400, detail="Enter Statement CODE above")
    try:
        reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
        if reader.is_encrypted:
            reader.decrypt(password)
        
        writer = PyPDF2.PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        
        decrypted_stream = BytesIO()
        writer.write(decrypted_stream)
        return decrypted_stream.getvalue()
    except Exception as e:
        raise HTTPException(status_code=400, detail="Incorrect password")

def preprocess_pdf_in_memory(pdf_bytes):
    """Optimize PDF for faster table extraction without writing to disk."""
    reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    writer = PyPDF2.PdfWriter()
    
    for page in reader.pages:
        writer.add_page(page)
    
    output_stream = BytesIO()
    writer.write(output_stream)
    return output_stream.getvalue()

def split_pdf_in_memory(pdf_bytes, skip_first=False):
    """Split PDF into individual pages in memory for parallel processing."""
    reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    total_pages = len(reader.pages)
    
    page_bytes = []
    start_page = 1
    if skip_first and total_pages > 1:
        start_page = 2
        
    for i in range(start_page-1, total_pages):
        writer = PyPDF2.PdfWriter()
        writer.add_page(reader.pages[i])
        output_stream = BytesIO()
        writer.write(output_stream)
        page_bytes.append((i+1, output_stream.getvalue()))
    
    return page_bytes

def process_single_page_bytes(page_tuple, skip_first_table=False):
    """Extract tables from a single page bytes."""
    page_num, page_bytes = page_tuple
    try:
        import tempfile
        
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=True) as temp_file:
            temp_file.write(page_bytes)
            temp_file.flush()
            
            tables = camelot.read_pdf(
                temp_file.name,
                pages='1',
                flavor='lattice',
                process_background=False,
                copy_text=['v'],
                line_scale=40,
                shift_text=[''],
                split_text=False,
                flag_size=False,
                layout_kwargs={'detect_vertical': False}
            )
        
        if tables.n == 0:
            return []
        
        all_data = []
        
        for table in tables:
            # Get table as DataFrame
            table_df = table.df
            
            # Skip the SUMMARY table
            if skip_first_table and "TRANSACTION TYPE" in table_df.to_string():
                continue
                
            # Handle the  statement table
            if len(table_df) > 0 and "Receipt No." in table_df.iloc[0, 0]:
                table_df.columns = ["Receipt No.", "Completion Time", "Details", 
                                  "Transaction Status", "paid in", "withdraw", "Balance"]
                table_df = table_df.drop(0).reset_index(drop=True)
            
            # Optimize string operations
            for col in table_df.select_dtypes(include=['object']).columns:
                table_df[col] = table_df[col].str.replace('\n', ' ', regex=False)
            
            all_data.append(table_df)
        
        return all_data
    except Exception as e:
        print(f"Error processing page {page_num}: {str(e)}")
        return []
    
def extract_tables_from_pdf_bytes(pdf_bytes, skip_first_table=True, max_workers=None, memory_limit=None):
    """Extract tables from PDF bytes with parallelization and memory optimization."""
    warnings.filterwarnings("ignore")
    
    reader = PyPDF2.PdfReader(BytesIO(pdf_bytes))
    total_pages = len(reader.pages)
    
    if max_workers is None:
        max_workers = min(multiprocessing.cpu_count() + 2, total_pages)
    
    if memory_limit is not None:
        available_mem_gb = memory_limit
        mem_per_process_gb = 0.5
        max_processes_by_mem = int(available_mem_gb / mem_per_process_gb)
        max_workers = min(max_workers, max_processes_by_mem)
    
    # Split PDF into individual pages in memory
    page_bytes = split_pdf_in_memory(pdf_bytes, skip_first=False)
    
    all_data = []
    
    # Process first page while skipping summary table 
    if page_bytes:
        first_page = page_bytes[0]
        first_page_results = process_single_page_bytes(
            first_page, 
            skip_first_table=skip_first_table
        )
        all_data.extend(first_page_results)
        
        # Process remaining pages normally
        remaining_pages = page_bytes[1:]
    else:
        remaining_pages = []
    
    # Process remaining pages in parallel
    if remaining_pages:
        batch_size = max(1, len(remaining_pages) // 4)
        batches = [remaining_pages[i:i+batch_size] for i in range(0, len(remaining_pages), batch_size)]
        
        for batch in batches:
            process_func = partial(process_single_page_bytes, skip_first_table=False)
            
            with Pool(processes=max_workers) as pool:
                batch_results = pool.map(process_func, batch)
                for result in batch_results:
                    all_data.extend(result)
    
    if all_data:
        try:
            combined_df = pd.concat(all_data, ignore_index=True)
            
            for col in combined_df.columns:
                if combined_df[col].dtype == 'object':
                    try:
                        if combined_df[col].nunique() / len(combined_df) < 0.5:
                            combined_df[col] = combined_df[col].astype('category')
                    except:
                        pass
            
            return combined_df
        except Exception as e:
            print(f"Error combining data: {str(e)}")
            return pd.concat(all_data, ignore_index=True) if all_data else None
    else:
        print("No tables found or all tables were empty.")
        return None

async def convert_ussd_pdf_to_csv(pdf_file, pin: str):
    print("Converting pdf to csv")
    start_time = time.time()
    pdf_bytes = await pdf_file.read()
    
    # Decrypt PDF
    decrypted_pdf = decrypt_pdf_bytes(pdf_bytes, pin)
    if not decrypted_pdf:
        print("Failed to decrypt PDF- wrong password.")
        return None
    try:
        #Extract customer name from the first page
        reader = PyPDF2.PdfReader(BytesIO(decrypted_pdf))
        first_page_text = reader.pages[0].extract_text()
        
        customer_name = "Unknown"
        name_match = re.search(r"Customer Name:\s*([^\n]+)", first_page_text)
        if name_match:
            customer_name = name_match.group(1).strip().replace("null", "")
        else:
            raise HTTPException(status_code=400, detail="PDF not an M-Pesa statement")

        # Optimize PDF in memory
        optimized_pdf = preprocess_pdf_in_memory(decrypted_pdf)
        
        # Extract tables
        df = extract_tables_from_pdf_bytes(
            optimized_pdf,
            skip_first_table=True,
            max_workers=None,
            memory_limit=8
        )
        
        if df is None:
            return None
        
        # Filter out numeric columns (0, 1, 2) in csv header
        numeric_cols = [col for col in df.columns if isinstance(col, (int, float)) or (isinstance(col, str) and col.isdigit())]
        if numeric_cols:
            df = df.drop(columns=numeric_cols)

        df = df[df['Receipt No.'].notna() & (df['Receipt No.'] != '')]
        df["customer name"] = customer_name

        df['withdraw'] = df['withdraw'].str.replace('-', '').str.replace(',', '').replace('', '0').astype(float)         
        df['paid in'] = df['paid in'].str.replace('-', '').str.replace(',', '').replace('', '0').astype(float)         

        # df.to_csv('uncleaned.csv', index=False)

        # Clean and return CSV
        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)

        cleaned_csv_content = csv_cleaner(csv_buffer)
        print(f"runtime: {time.time() - start_time:.2f}")
        return cleaned_csv_content
    except Exception as e:
        print(f"PDF processing error: {e}")
        raise