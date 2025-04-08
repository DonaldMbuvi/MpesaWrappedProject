from pypdf import PdfReader, PdfWriter
import pdfplumber
import pandas as pd
import re
import os

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
                    name_match = re.search(r"Customer\s*Name:\s*(.*?)(?:\n|$)", text, re.IGNORECASE)
                    if name_match:
                        customer_name = name_match.group(1).strip()
                
                if not mobile_number:
                    mobile_match = re.search(r"Mobile\s*Number:\s*([0-9]{10,12})", text, re.IGNORECASE)
                    if mobile_match:
                        mobile_number = mobile_match.group(1).strip()
                
                # Process transactions line by line
                lines = text.split('\n')
                current_transaction = None
                
                for line in lines:
                    line = line.strip()
                    if not line:
                        continue
                    
                    # New transaction starts with TC
                    if line.startswith('TC') and len(line.split()) >= 6:
                        if current_transaction:
                            extracted_transactions.append(current_transaction)
                        
                        parts = line.split()
                        current_transaction = {
                            "Receipt No": parts[0],
                            "Completion Time": f"{parts[1]} {parts[2]}",
                            "Details": "",
                            "Transaction Status": parts[-3],
                            "Paid In": None,
                            "Withdrawn": None,
                            "Balance": parts[-1] if parts[-1] != '-' else None,
                            "User Name": customer_name,
                            "Mobile Number": mobile_number
                        }
                        
                        # Process the middle part of the transaction line to identify details
                        # and determine if it's a Paid In or Withdrawn transaction
                        middle_parts = ' '.join(parts[3:-3])
                        current_transaction["Details"] = middle_parts
                        
                        # Check if Withdrawn is present (it would be the second-to-last element)
                        withdrawn_val = parts[-2]
                        if withdrawn_val != '-' and withdrawn_val[0] == '-':
                            # Negative amount indicates withdrawal
                            current_transaction["Withdrawn"] = withdrawn_val
                        elif withdrawn_val != '-' and not withdrawn_val[0] == '-':
                            # Positive amount without negative sign is a deposit
                            current_transaction["Paid In"] = withdrawn_val
                    
                    # Handle multi-line details
                    elif current_transaction and not line.startswith('TC'):
                        current_transaction["Details"] += ' ' + line
                
                # Add the last transaction
                if current_transaction:
                    extracted_transactions.append(current_transaction)

        # Create DataFrame and clean data
        if extracted_transactions:
            df = pd.DataFrame(extracted_transactions)
            
            # Convert numeric columns
            for col in ['Paid In', 'Withdrawn', 'Balance']:
                df[col] = df[col].astype(str).str.replace(',', '')
                df[col] = pd.to_numeric(df[col], errors='coerce')
                df[col] = df[col].where(pd.notnull(df[col]), None)
            
            # Remove duplicates
            df = df.drop_duplicates(subset=['Receipt No', 'Completion Time', 'Details'], keep='first')
            
            # Save to CSV with proper NULL handling
            csv_file = os.path.splitext(pdf_file)[0] + ".csv"
            df.to_csv(csv_file, index=False, na_rep='NULL')
            print(f"Successfully saved {len(df)} transactions to {csv_file}")
            return True
        else:
            print("No transactions extracted - check PDF format")
            return False

    except Exception as e:
        print(f"Error processing PDF: {str(e)}")
        return False

if __name__ == "__main__":
    pdf_path = r"C:\Users\HP\Desktop\3.2 Project\MpesaWrappedProject\MOSES_STMNT.pdf"
    user_passcode = input("Enter passcode: ")
    
    decrypted_file = decrypt_mpesa_statement(pdf_path, user_passcode)

    if decrypted_file:
        print(f"Decrypted file saved at: {decrypted_file}")
        convert_pdf_to_csv(decrypted_file)