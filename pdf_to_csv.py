#CONVERTING PDF TO CSV
import fitz
import pandas as pd
import re

pdf_file = "MpesaStatement.pdf"

try:
    doc = fitz.open(pdf_file)
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
    
    csv_file = "MpesaStatement.csv"
    df.to_csv(csv_file, index=False)
    print(f"PDF transactions saved to {csv_file}")

except Exception as e:
    print(f"Error: {e}. Please check if the file exists and is a valid PDF.")
