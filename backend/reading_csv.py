import re
import pandas as pd
from io import StringIO

def csv_cleaner(csvFile):
    try:
        df = pd.read_csv(csvFile, sep=",", engine="python")

        df.columns = df.columns.str.lower()

        # Extract customer details (assuming they are in the first row)
        customer_name = df["customer name"].iloc[0] if "customer name" in df.columns else "Unknown"
        mobile_number = df["mobile number"].iloc[0] if "mobile number" in df.columns else "Unknown"

        def categorize_transaction(description):
            description = description.strip().lower()
            if "pay bill" in description:
                return "Pay Bill"
            elif "m-shwari deposit" in description:
                return "M-Shwari Deposit"
            elif "m-shwari withdraw" in description:
                return "M-Shwari Withdrawal"
            elif "merchant payment" in description:
                return "Till Payment"
            elif "customer transfer" in description and "received" in description:
                return "Received Money"
            elif "customer transfer of funds charge" in description:
                return "Send Money costs"
            elif "customer transfer" in description:
                return "Send Money"
            elif "equity bulk account" in description:
                return "Bulk Payment Received"
            elif "airtime" in description:
                return "Airtime Purchase"
            elif "bundle purchase" in description:
                return "Bundle Purchase"
            elif "small business" in description:
                return "Pochi la Biashara"
            else:
                return "Other"
        def extract_recipient(description, category): 
            if category in ["M-Shwari Deposit", "M-Shwari Withdrawal"]:
                return None  #don't have a recipient

            description = str(description).strip()  # Ensure it's a string

            if "bundle purchase" in description.lower():
                return "SAFARICOM DATA BUNDLES"
            
            description = re.sub(r"Small Business to (\d{3,}|\*\*\*)?-?\s*", "", description, flags=re.IGNORECASE)

            description = re.sub(r"to (\d{3,}|\*\*\*)? -\s*", "", description, flags=re.IGNORECASE)

            # **Handling KPLC Transactions**
            if "kplc" in description.lower():
                match = re.search(r"to (?:\d{3,}|\S+) - ([^,]+)", description)
                if match:
                    return re.sub(r"\d+", "", match.group(1).split()[0]).strip()

            # **Extracting Names for Other Transactions**
            match = re.search(r"to (.+?)(?:\s*Acc\.|$)", description, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                name = re.sub(r"^[^a-zA-Z]+", "", name)  
                return re.sub(r"\d+", "", name).strip() 

            return description 
        def extract_transaction(row):
            date_time = row["completion time"].split(" ")
            date = date_time[0]
            time = ":".join(date_time[1].split(":")[:2])
            description = row["details"].strip()

            category = categorize_transaction(description)
            paid_to = extract_recipient(description, category)

            if category in ["M-Shwari Withdrawal", "Received Money", "Bulk Payment Received"]:
                amount_in = row["paid in"] if "paid in" in row else 0
                amount_out = 0
            elif category == "M-Shwari Deposit":
                amount_in = 0
                amount_out = row["withdraw"] if "withdraw" in row else 0
            else:
                amount_in = 0
                amount_out = row["withdraw"] if "withdraw" in row else 0

            return date, time, category, paid_to, amount_in, amount_out, customer_name, mobile_number

        transactions_data = df.apply(extract_transaction, axis=1)

        # Convert to DataFrame with customer details
        transactions_df = pd.DataFrame(transactions_data.tolist(), columns=[
            "Date", "Time", "Category", "Paid To", "Amount In", "Amount Out", "User Name", "Mobile Number"
        ])

         # Instead of saving to file, return the CSV content as a string
        csv_buffer = StringIO()
        transactions_df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        csv_content = csv_buffer.getvalue()
        print("Cleaned transactions processed successfully")
        return csv_content
    except Exception as e:
        print(f"ERROR: {e}")
        return None