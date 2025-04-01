#CONVERTING PDF TO CSV
from io import StringIO
import fitz
import pandas as pd
import re

from reading_csv import csv_cleaner

def convert_pdf_to_csv(pdf_file):
    try:
        try:
            print("ptc.py - pdf file passed is: ",pdf_file)
            with open(pdf_file, 'rb') as f:
                pdf_bytes = f.read()
            print("ptc.py - done reading pdf file")
        except Exception as e:
            print(f"ptc.py - Error reading PDF: {e}")
            return
        try:
            # Open the PDF from bytes
            doc = fitz.open("pdf", pdf_bytes)  # "pdf" forces PyMuPDF to read from bytes
            data = []
            print("ptc.py - PDF successfully opened from bytes")
        except Exception as e:
            print("ptc.py - Error opening PDF from bytes: {e}")
        customer_name= None 
        mobile_number= None
        
        for page_nm in range(len(doc)):
            page = doc[page_nm]
            text = page.get_text("text")

            name_match= re.search(r"Customer Name: \s*(.*)", text)
            mobile_match= re.search(r"Mobile Number: \s*(\d+)", text)
            
            if name_match:
                customer_name= name_match.group(1).strip()
            if mobile_match:
                mobile_number=mobile_match.group(1).strip()
                
            transactions = re.findall(
                r'([A-Z0-9]{10})\s+(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+([\s\S]*?)\s+(COMPLETED|FAILED|PENDING)\s+([\d,]+\.\d{2})?\s+([\d,]+\.\d{2})?\s+([\d,]+\.\d{2})?',
                text
            )

            for transaction in transactions:
                receipt_no, completion_time, details, status, paid_in, withdraw, balance = transaction
                details = " ".join(details.splitlines()).strip()  # Join multiline details into one line
                data.append([receipt_no, completion_time, details, status, paid_in, withdraw, balance])

        doc.close()

        # Create DataFrame
        df = pd.DataFrame(data, columns=["Receipt No", "Completion Time", "Details", "Transaction Status", "Paid In", "Withdraw", "Balance"])
        df["Customer Name"]= customer_name
        df["Mobile Number"]= mobile_number
        
        # Convert to CSV (in-memory)
        csv_buffer = StringIO()
        try:
            df.to_csv(csv_buffer, index=False)
        except Exception as e:
            print("ptc.py - Error encounterred while converting pdf to csv: ", e)
            return
        csv_buffer.seek(0)  # Reset pointer

        # Clean CSV without writing to disk
        cleaned_csv_content  = csv_cleaner(csv_buffer)

        return cleaned_csv_content   # Return cleaned CSV directly
    except Exception as e:	
        print(f"Error: {e}. Please check if the file exists and is a valid PDF.")
    return  None
