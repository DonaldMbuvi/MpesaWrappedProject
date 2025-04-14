#CONVERTING PDF TO CSV
from io import StringIO
import fitz
import pandas as pd
import re

from reading_csv import csv_cleaner

def convert_pdf_to_csv(pdf_file):

    try:
        # Read the uploaded file into memory
        pdf_bytes = pdf_file.file.read()

        # Open the PDF from bytes
        doc = fitz.open("pdf", pdf_bytes)  # "pdf" forces PyMuPDF to read from bytes

        data = []
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
        df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)  # Reset pointer

        # Clean CSV without writing to disk
        cleaned_csv_content  = csv_cleaner(csv_buffer)

        return cleaned_csv_content   # Return cleaned CSV directly
    except Exception as e:	
        print(f"Error: {e}. Please check if the file exists and is a valid PDF.")
    return  None
