from pypdf import PdfReader, PdfWriter
import pdfplumber
import pandas as pd
import re
import os
from datetime import datetime

def decrypt_mpesa_statement(pdf_path, passcode):
    try:
        with open(pdf_path, "rb") as file:
            reader = PdfReader(file)
            if reader.decrypt(passcode):
                print("Decryption successful!")
                decrypted_pdf_path = os.path.splitext(pdf_path)[0] + "_decrypted.pdf"
                writer = PdfWriter()
                for page in reader.pages:
                    writer.add_page(page)
                with open(decrypted_pdf_path, "wb") as output_file:
                    writer.write(output_file)
                return decrypted_pdf_path
            else:
                print("Incorrect passcode. Decryption failed.")
                return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def convert_pdf_to_csv(pdf_file):
    extracted_transactions = []
    try:
        with pdfplumber.open(pdf_file) as pdf:
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
                
                # Process transactions - specific pattern for M-Pesa
                lines = text.split('\n')
                current_transaction = None
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # Match transaction lines (starts with TD followed by alphanum)
                    if re.match(r'^TD[0-9A-Z]{8,10}\s+', line):
                        if current_transaction:
                            extracted_transactions.append(current_transaction)
                        
                        # Split the line into components
                        parts = line.split()
                        if len(parts) >= 6:
                            try:
                                # Reconstruct the completion time
                                completion_time = f"{parts[1]} {parts[2]}"
                                
                                # The details might be split, so join remaining parts
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
                    
                    # Handle multi-line details
                    elif current_transaction and (line.startswith('Business to') or line.startswith('Pay Bill') or line.startswith('ELIAS') or line.startswith('JANE')):
                        current_transaction["Details"] += " " + line
                
                # Add the last transaction of the page
                if current_transaction:
                    extracted_transactions.append(current_transaction)

        # Create DataFrame and clean data
        if extracted_transactions:
            df = pd.DataFrame(extracted_transactions)
            
            # Convert numeric columns
            for col in ['Paid In', 'Withdrawn', 'Balance']:
                if col in df.columns:
                    df[col] = df[col].astype(str).str.replace(',', '')
                    df[col] = pd.to_numeric(df[col], errors='coerce')
                    df[col] = df[col].where(pd.notnull(df[col]), None)
            
            # Remove duplicates
            df = df.drop_duplicates(subset=['Receipt No', 'Completion Time', 'Details'], keep='first')
            
            # Generate standardized CSV filename
            current_time = datetime.now().strftime("%Y%m%d_%H%M%S")
            safe_name = re.sub(r'[^a-zA-Z0-9]', '_', customer_name) if customer_name else "Mpesa"
            csv_filename = f"Mpesa_Transactions_{safe_name}_{current_time}.csv"
            csv_path = os.path.join(os.path.dirname(pdf_file), csv_filename)
            
            # Save to CSV
            df.to_csv(csv_path, index=False, na_rep='NULL')
            print(f"\nSuccessfully saved {len(df)} transactions to:")
            print(f"--> {csv_path}")
            return csv_path
        else:
            print("\nNo transactions extracted - check PDF format")
            return None

    except Exception as e:
        print(f"\nError processing PDF: {str(e)}")
        return None

if __name__ == "__main__":
    # Get the current script directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Specify PDF path (now relative to script location)
    pdf_path = os.path.join(script_dir, "Newtonn.pdf")
    
    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"\nError: PDF file not found at {pdf_path}")
        print("Please ensure the PDF is in the same folder as this script and named 'Newtonn.pdf'")
    else:
        user_passcode = input("Enter M-Pesa statement passcode: ")
        decrypted_file = decrypt_mpesa_statement(pdf_path, user_passcode)

        if decrypted_file:
            print(f"\nDecrypted file saved at: {decrypted_file}")
            csv_path = convert_pdf_to_csv(decrypted_file)
            
            if csv_path:
                print("\nProcess completed successfully!")
                print(f"Transactions saved to: {csv_path}")
            else:
                print("\nFailed to extract transactions from PDF")
                print("Please check that the PDF contains transactions in the expected format.")
                print("You may need to manually verify the PDF content.")