from pypdf import PdfReader, PdfWriter
import pdfplumber
import pandas as pd
import re
import os
import unicodedata


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
                print("NEEEIIN.... Incorrect passcode. Decryption failed.")
                return None
    except Exception as e:
        print(f"Error: {e}")
        return None


def normalize_text(text):
    return unicodedata.normalize("NFKD", text)


def convert_pdf_to_csv(pdf_file):
    extracted_transactions = []
    try:
        with pdfplumber.open(pdf_file) as pdf:
            customer_name = ""
            mobile_number = ""

            for page_num, page in enumerate(pdf.pages, start=1):
                text = page.extract_text()
                if text:
                    print(f"\nExtracted text from page {page_num}:\n{text[:50]}...\n")

                    
                    name_match = re.search(r"Customer Name:\s*(.*)", text)
                    mobile_match = re.search(r"Mobile Number:\s*(\d+)", text)

                    if name_match:
                        customer_name = name_match.group(1).strip()
                        print(f"Customer Name found: {customer_name}")

                    if mobile_match:
                        mobile_number = mobile_match.group(1).strip()
                        print(f"Mobile Number found: {mobile_number}")

                    
                    transaction_pattern = re.compile(
                        #add for customer name and number
                        r"(TCR|TC[A-Z0-9]{8})\s+"  
                        r"(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\s+"  
                        r"(.+?)\s+"  
                        r"(Completed|Failed)\s+"  
                        r"(-?\d+,\d+.\d+|-?\d+.\d+|-?)\s+" 
                        r"(-?\d+,\d+.\d+|-?\d+.\d+|-?)\s+"  
                        r"(-?\d+,\d+.\d+|-?\d+.\d+|-?)",  
                        re.MULTILINE
                    )

                    matches = transaction_pattern.findall(text)
                    if matches:
                        print(f"Transactions found on page {page_num}: {len(matches)}")

                    for match in matches:
                        extracted_transactions.append({
                            "Receipt No": match[0],
                            "Completion Time": match[1],
                            "Details": match[2],
                            "Transaction Status": match[3],
                            "Paid In": match[4],
                            "Withdrawn": match[5],
                            "Balance": match[6],
                            "User Name": customer_name, 
                            "Mobile Number": mobile_number
                        })

        
        if not extracted_transactions:
            print(" No transactions extracted! Check regex or PDF format.")
            return

        
        # df_customer = pd.DataFrame([
        #     {"Receipt No": "Customer Name", "Completion Time": customer_name},
        #     {"Receipt No": "Mobile Number", "Completion Time": mobile_number}
        # ])
        
       
        df_transactions = pd.DataFrame(extracted_transactions)
        
      
        df_final = pd.concat([df_transactions], ignore_index=True)
        
        
        csv_file = os.path.splitext(pdf_file)[0] + ".csv"
        df_final.to_csv(csv_file, index=False)
        print(f"[+] CSV successfully saved as '{csv_file}'!")
    
    except Exception as e:
        print(f"Error: {e}. Please check if the file exists and is a valid PDF.")

if __name__ == "__main__":
    
    pdf_path = r"C:\Users\HP\Desktop\3.2 Project\MpesaWrappedProject\MOSES_STMNT.pdf"
    user_passcode = input("Enter passcode: ") # Current passcode is 805530
    

    decrypted_file = decrypt_mpesa_statement(pdf_path, user_passcode)

    if decrypted_file:
        print(f"Decrypted file saved at: {decrypted_file}")
        convert_pdf_to_csv(decrypted_file)
