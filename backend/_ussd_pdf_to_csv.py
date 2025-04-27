from _ussd_reading_csv import csv_cleaner
from pypdf import PdfReader, PdfWriter
import pdfplumber
import pandas as pd
import re
from io import BytesIO, StringIO
from datetime import datetime

def decrypt_mpesa_statement_in_memory(pdf_bytes: bytes, passcode: str) -> bytes | None:
    """Decrypts PDF in memory and returns decrypted PDF bytes."""
    try:
        reader = PdfReader(BytesIO(pdf_bytes))
        if not reader.decrypt(passcode):
            print("Incorrect passcode. Decryption failed.")
            return None
        
        writer = PdfWriter()
        for page in reader.pages:
            writer.add_page(page)
        
        decrypted_pdf_bytes = BytesIO()
        writer.write(decrypted_pdf_bytes)
        return decrypted_pdf_bytes.getvalue()
    
    except Exception as e:
        print(f"Decryption error: {e}")
        return None

async def convert_ussd_pdf_to_csv(pdf_file, pin: str):
    """Processes PDF bytes and returns cleaned CSV content."""
    pdf_bytes = await pdf_file.read()
    if pin:
        decrypted_pdf = decrypt_mpesa_statement_in_memory(pdf_bytes, pin)
        if not decrypted_pdf:
            return None
        pdf_bytes = decrypted_pdf

    extracted_transactions = []
    try:
        with pdfplumber.open(BytesIO(pdf_bytes)) as pdf:
            customer_name = ""
            mobile_number = ""
            
            for page in pdf.pages:
                text = page.extract_text()
                if not text:
                    continue
                
                # Extract customer info
                if not customer_name:
                    name_match = re.search(r"Customer Name:\s*(.*?)(?:\n|$)", text, re.IGNORECASE)
                    if name_match:
                        customer_name = name_match.group(1).strip()
                
                if not mobile_number:
                    mobile_match = re.search(r"Mobile Number:\s*([0-9]{9,12})", text, re.IGNORECASE)
                    if mobile_match:
                        mobile_number = mobile_match.group(1).strip()
                
                # Process transactions
                lines = text.split('\n')
                current_transaction = None
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    if re.match(r'^TD[0-9A-Z]{8,10}\s+', line):
                        if current_transaction:
                            extracted_transactions.append(current_transaction)
                        
                        parts = line.split()
                        if len(parts) >= 6:
                            try:
                                completion_time = f"{parts[1]} {parts[2]}"
                                details_end = -3 if parts[-3] in ['Completed', 'Failed'] else -2
                                details = ' '.join(parts[3:details_end])
                                
                                current_transaction = {
                                    "Receipt No": parts[0],
                                    "Completion Time": completion_time,
                                    "Details": details,
                                    "Transaction Status": parts[details_end],
                                    "Amount": parts[details_end+1],
                                    "Balance": parts[details_end+2] if len(parts) > details_end+2 else None,
                                    "User Name": customer_name,
                                    "Mobile Number": mobile_number
                                }
                                
                                # Convert amount to Paid In/Withdrawn
                                amount = parts[details_end+1].replace(',', '')
                                if '-' in amount:
                                    current_transaction["Withdrawn"] = amount.replace('-', '')
                                    current_transaction["Paid In"] = None
                                else:
                                    current_transaction["Paid In"] = amount
                                    current_transaction["Withdrawn"] = None
                            except IndexError:
                                continue
                    
                    elif current_transaction:
                        current_transaction["Details"] += " " + line.strip()
                
                if current_transaction:
                    extracted_transactions.append(current_transaction)

        if not extracted_transactions:
            print("No transactions extracted.")
            return None
        
        df = pd.DataFrame(extracted_transactions)
        
        # Clean numeric columns
        for col in ['Paid In', 'Withdrawn', 'Balance']:
            if col in df.columns:
                df[col] = df[col].astype(str).str.replace(',', '')
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col] = df[col].where(pd.notnull(df[col]), None)
        
        df = df.drop_duplicates(
            subset=['Receipt No', 'Completion Time', 'Details'],
            keep='first'
        )
        csv_buffer = StringIO()
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)  # Reset pointer

        # Clean CSV without writing to disk
        cleaned_csv_content = csv_cleaner(csv_buffer)
        
        return cleaned_csv_content
    
    except Exception as e:
        print(f"PDF processing error: {e}")
        return None