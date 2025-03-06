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
            description = description.lower()
            if "pay bill" in description:
                return "Pay Bill"
            elif "m-shwari deposit" in description:
                return "M-Shwari Deposit"
            elif "m-shwari withdraw" in description:
                return "M-Shwari Withdrawal"
            elif "merchant payment" in description:
                return "Merchant Payment"
            elif "customer transfer" in description:
                return "Send Money"
            elif "airtime" in description or "bundle purchase" in description:
                return "Airtime Purchase"
            else:
                return "Other"

        def extract_transaction(row):
            date_time = row["completion time"].split(" ")  # Split date and time
            date = date_time[0]
            description = row["details"].strip()

            if "M-Shwari Withdraw" in description:
                amount = row["paid in"]
            else:
                amount = row["withdraw"]

            category = categorize_transaction(description)

            return date, description, amount, category, customer_name, mobile_number

        transactions_data = df.apply(extract_transaction, axis=1)

        # Convert to DataFrame with customer details
        transactions_df = pd.DataFrame(transactions_data.tolist(), columns=[
            "Date", "Transaction Type", "Amount", "Category", "Customer Name", "Mobile Number"
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