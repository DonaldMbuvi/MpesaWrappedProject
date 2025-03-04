import pandas as pd

csvFile = "MpesaStatement.csv"

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
            return "Customer Transfer"
        elif "airtime" in description or "bundle purchase" in description:
            return "Airtime Purchase"
        else:
            return "Other"

    def extract_transaction(row):
        date_time = row["completion time"].split(" ")  # Split date and time
        date = date_time[0]
        time = date_time[1]
        description = row["details"].strip()
        transaction_id = row["receipt no"]

        if "M-Shwari Withdraw" in description:
            amount = row["paid in"]
        else:
            amount = row["withdraw"]

        category = categorize_transaction(description)

        return date, time, description, amount, transaction_id, category, customer_name, mobile_number

    transactions_data = df.apply(extract_transaction, axis=1)

    # Convert to DataFrame with customer details
    transactions_df = pd.DataFrame(transactions_data.tolist(), columns=[
        "Date", "Time", "Transaction Type", "Amount", "TransactionID", "Category", "Customer Name", "Mobile Number"
    ])

    transactions_df.to_csv("CleanedMpesaTransactions.csv", index=False)
    print("Cleaned transactions saved to CleanedMpesaTransactions.csv")

except Exception as e:
    print(f"ERROR: {e}")
