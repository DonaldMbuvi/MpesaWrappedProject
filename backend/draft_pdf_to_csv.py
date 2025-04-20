import camelot
import fitz
import tempfile
import os
import re
import pandas as pd
from io import StringIO
from reading_csv import csv_cleaner

def convert_pdf_to_csv(pdf_file):
    try:
        # Save PDF to temporary file
        with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_pdf:
            temp_pdf.write(pdf_file.file.read())
            temp_pdf_path = temp_pdf.name
        
        # Try both lattice and stream flavors
        tables = []
        try:
            tables = camelot.read_pdf(temp_pdf_path, pages='all', flavor='lattice')
        except Exception as e:
            print(f"Lattice failed, trying stream: {e}")
            tables = camelot.read_pdf(temp_pdf_path, pages='all', flavor='stream')
        
        if not tables:
            print("No tables found by Camelot")
            return None
            
        # Combine all tables (don't skip the first one)
        dfs = [t.df for t in tables]
        df = pd.concat(dfs, ignore_index=True)
        
        # Clean up headers
        df.columns = df.iloc[0].str.strip().str.lower()
        df = df[1:].reset_index(drop=True)
        
        # Standardize column names
        column_mapping = {
            'receipt no': 'receipt no',
            'completed': 'completion time',
            'date': 'completion time',
            'transaction date': 'completion time',
            'time': 'completion time',
            'details': 'details',
            'transaction details': 'details',
            'amount': 'withdraw',
            'debit': 'withdraw',
            'credit': 'paid in',
            'deposit': 'paid in',
            'balance': 'balance',
            'status': 'transaction status'
        }
        
        # Rename columns
        df.columns = [column_mapping.get(col.lower().strip(), col) for col in df.columns]
        
        # Extract customer info using PyMuPDF
        doc = fitz.open(temp_pdf_path)
        text = ""
        for page in doc:
            text += page.get_text("text")
        doc.close()
        
        # Extract customer info
        customer_name = None
        mobile_number = None
        name_match = re.search(r"(?:Customer|Client)\s*Name[:\s]*(.*?)(?:\n|$)", text, re.IGNORECASE)
        mobile_match = re.search(r"(?:Mobile|Phone)\s*(?:Number|No)[:\s]*([+\d\s-]+)", text, re.IGNORECASE)
        
        if name_match:
            customer_name = name_match.group(1).strip()
        if mobile_match:
            mobile_number = re.sub(r"\s+", "", mobile_match.group(1).strip())
        
        # Filter out empty rows (where receipt no is empty)
        receipt_col = [col for col in df.columns if 'receipt' in col.lower()]
        if receipt_col:
            df = df[df[receipt_col[0]].str.strip().astype(bool)]
        
        # Add customer info if found
        if customer_name:
            df["Customer Name"] = customer_name
        if mobile_number:
            df["Mobile Number"] = mobile_number
        
        # Clean data
        df.replace(r'^\s*$', '0.00', regex=True, inplace=True)
        df.fillna("0.00", inplace=True)
        df = df.applymap(lambda x: str(x).replace('\n', ' ') if isinstance(x, str) else x)
        
        # Define and select desired columns
        desired_columns = [
            "Receipt No", "Completion Time", "Details", "Transaction Status",
            "Paid In", "Withdraw", "Balance", "Customer Name", "Mobile Number"
        ]
        
        # Select only columns that exist in the dataframe
        available_columns = [col for col in desired_columns if col.lower() in [c.lower() for c in df.columns]]
        df = df[available_columns]
        
        # Convert to CSV
        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        with open("_2raw_.csv", "w") as f:
            f.write(csv_buffer.getvalue())
        # Clean up
        os.unlink(temp_pdf_path)
        
        return csv_cleaner(csv_buffer)
        
    except Exception as e:
        print(f"Error processing PDF: {e}")
        import traceback
        traceback.print_exc()
        if 'temp_pdf_path' in locals() and os.path.exists(temp_pdf_path):
            os.unlink(temp_pdf_path)
        return None