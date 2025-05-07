import re
import pandas as pd
from io import StringIO

def csv_cleaner(csvFile):
    try:
        df = pd.read_csv(csvFile, sep=",", engine="python")

        df.columns = df.columns.str.strip().str.lower()

        # Extract customer name
        customer_name = df["customer name"].iloc[0] if "customer name" in df.columns else "Unknown"
        statement_start = df["statement start"].iloc[0] if "statement start" in df.columns else "Unknown"
        
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
            elif "business payment" in description and "pay bill" not in description:
                return "Bank"
            else:
                return "Other"
        def extract_recipient(description, category): 
            if category in ["M-Shwari Deposit", "M-Shwari Withdrawal"]:
                return None  

            description = str(description).strip() 

            if "bundle purchase" in description.lower():
                return "SAFARICOM DATA BUNDLES"
            
            description = re.sub(r"Small Business to (\d{3,}|\*\*\*)?-?\s*", "", description, flags=re.IGNORECASE)

            description = re.sub(r"to (\d{3,}|\*\*\*)? -\s*", "", description, flags=re.IGNORECASE)

            # Handling KPLC Transactions
            if "kplc" in description.lower():
                match = re.search(r"to (?:\d{3,}|\S+) - ([^,]+)", description)
                if match:
                    return re.sub(r"\d+", "", match.group(1).split()[0]).strip()

            # Extract bank name
            if "business payment" in description.lower():
                match = re.search(r"-\s*(\w+)", description)
                if match:
                    bank_name = match.group(1)
                    return bank_name
            
            # Extract Names for Other Transactions
            match = re.search(r"to (.+?)(?:\s*Acc\.|$)", description, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                name = re.sub(r"^[^a-zA-Z]+", "", name)  
                return re.sub(r"\d+", "", name).strip() 

            return description 
        def extract_transaction(row):
            date_time = str(row["completion time"]).split(" ")
            date = date_time[0]
            time = ":".join(date_time[1].split(":")[:2])
            
            description = str(row["details"]).strip()

            category = categorize_transaction(description)
            paid_to = extract_recipient(description, category)

            if category in ["M-Shwari Withdrawal", "Received Money", "Bulk Payment Received"]:
                amount_in = row["paid in"] if "paid in" in row else 0
                amount_out = 0
            elif category == "M-Shwari Deposit":
                amount_in = 0
                amount_out = row["withdraw"] if "withdraw" in row else 0
            else:
                amount_in = row["paid in"] if "paid in" in row else 0
                amount_out = row["withdraw"] if "withdraw" in row else 0

            return date, time, category, paid_to, amount_in, amount_out, customer_name, statement_start

        transactions_data = df.apply(extract_transaction, axis=1)

        # Convert to DataFrame with customer details
        transactions_df = pd.DataFrame(transactions_data.tolist(), columns=[
            "Date", "Time", "Category", "Paid To", "Amount In", "Amount Out", "User Name", "Start Date"
        ])

        # return the CSV content as a string
        csv_buffer = StringIO()
        transactions_df.to_csv(csv_buffer, index=False)
        csv_buffer.seek(0)
        csv_content = csv_buffer.getvalue()

        # with open("cleaned.csv", "w") as f:
        #     f.write(csv_content)
        return csv_content
    except Exception as e:
        print(f"ERROR: {e}")
        # import traceback
        # traceback.print_exc()
        return None