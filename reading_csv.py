import pandas as pd
import re

csvFile = "MpesaStatement.csv"

try:
    df = pd.read_csv(csvFile, sep=",", engine="python")
    df.columns = df.columns.str.lower()

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
            return None  # Set self-transactions to null

        # If it's a Bundle Purchase, remove "by *** - Julius Abigail Cherotich"
        if "bundle purchase" in description.lower():
            return "SAFARICOM DATA BUNDLES"

        # If it's a KPLC transaction, extract only the first word (without numbers)
        if "kplc" in description.lower():
            match = re.search(r"to (?:\d{3,}|\S+) - ([^,]+)", description)
            if match:
                return re.sub(r"\d+", "", match.group(1).split()[0]).strip()  # Remove numbers and return first word
            
        if "small business to *** - " in description:
            match = re.search(r"small business to \*\*\* - (.+)", description, re.IGNORECASE)
            if match:
                name = match.group(1).strip()
                return re.sub(r"[^a-zA-Z\s]", "", name).strip()  # Remove non-alphabetic characters 

        # For other transactions, capture the full name and remove numbers
        match = re.search(r"to (.+?)(?:\s*Acc\.|$)", description, re.IGNORECASE)
        if match:
            name = match.group(1).strip()
            name = re.sub(r"^[^a-zA-Z]+", "", name)  # Remove leading non-alphabetic characters
            return re.sub(r"\d+", "", name).strip()  # Remove numbers from full name

        return None

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

    transactions_df = pd.DataFrame(transactions_data.tolist(), columns=[
        "Date", "Time", "Category", "Paid To", "Amount In", "Amount Out", "User Name", "Mobile Number"
    ])

    transactions_df.fillna("NULL", inplace=True)  
    transactions_df.to_csv("CleanedMpesaTransactions.csv", index=False)
    print("Cleaned transactions saved to CleanedMpesaTransactions.csv")

except Exception as e:
    print(f"ERROR: {e}")
