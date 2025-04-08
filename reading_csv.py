import pandas as pd
import re

csvFile = r"C:\Users\HP\Desktop\3.2 Project\MpesaWrappedProject\MOSES_STMNT_decrypted.csv"

try:
    df = pd.read_csv(csvFile, sep=",", engine="python")
    df.columns = df.columns.str.lower()

    # Extract customer info
    customer_name = df["user name"].iloc[0] if "user name" in df.columns else (
        df["customer name"].iloc[0] if "customer name" in df.columns else "Unknown"
    )
    mobile_number = df["mobile number"].iloc[0] if "mobile number" in df.columns else "Unknown"

    def clean_description(description):
        # Remove the Safaricom disclaimer statement
        disclaimer_pattern = r"DISCLAIMER: ANY PERSONAL INFORMATION SHARED WITH YOU SHOULD BE HANDLED IN ACCORDANCE WITH THE DATA PROTECTION ACT AND ONLY USED FOR THE PURPOSE FOR WHICH IT WAS PROVIDED. STATEMENT VERIFICATION CODE TO VERIFY THE VALIDITY OF THIS M-PESA STATEMENT DIAL \*334#, SELECT MY ACCOUNT AND FOLLOW THE PROMPTS TO ENTER THE CODE. \w+ FOR SELF-HELP DIAL \*334# \| WEB: WWW\.SAFARICOM\.CO\.KE \| TWITTER: @SAFARICOMPLC \| @SAFARICOM_CARE \| FACEBOOK: SAFARICOM PLC \| TERMS AND CONDITIONS APPLY"
        cleaned = re.sub(disclaimer_pattern, "", str(description), flags=re.IGNORECASE)
        return cleaned.strip()

    def categorize_transaction(description):
        description = clean_description(description).lower()
        
        # Check for Pochi la Biashara first
        if "small business" in description:
            return "Pochi la Biashara"
        elif "pay bill" in description:
            return "Pay Bill"
        elif "m-shwari deposit" in description:
            return "M-Shwari Deposit"
        elif "m-shwari withdraw" in description:
            return "M-Shwari Withdrawal"
        elif "merchant payment" in description or "till payment" in description:
            return "Till Payment"
        elif "funds received" in description or "received from" in description:
            return "Received Money"
        elif "customer transfer of funds charge" in description:
            return "Send Money costs"
        elif "customer transfer" in description or "customer payment" in description:
            return "Send Money"
        elif "equity bulk account" in description:
            return "Bulk Payment Received"
        elif "airtime" in description:
            return "Airtime Purchase"
        elif "bundle purchase" in description:
            return "Bundle Purchase"
        else:
            return "Other"

    def extract_recipient(description, category):
        description = clean_description(description)
        
        if category in ["M-Shwari Withdrawal", "M-Shwari Deposit"]:
            return None
        
        # Remove all masked phone numbers (patterns like 07******799, 2547*****555, etc.)
        description = re.sub(r"(?:-?\d+\*+\d*|-\d+\*+)", "", description)
        
        # Handle KPLC payments
        if "kplc" in description.lower():
            match = re.search(r"to (\d+) - (kplc prepaid)", description, re.IGNORECASE)
            if match:
                return f"{match.group(2)} Acc. {match.group(1)}"
        
        # Handle merchant/till payments
        if "merchant payment" in description.lower() or "till" in description.lower():
            match = re.search(r"to (\d+) - (.+?)(?:\s*$)", description)
            if match:
                return match.group(2).strip()
        
        # Extract only names for Send Money or Pochi la Biashara transactions
        if category in ["Send Money", "Pochi la Biashara"]:
            if "customer transfer to" in description.lower():
                # Extract the name after "Customer Transfer to"
                name = description.lower().split("customer transfer to")[1].strip().upper()
                return name
            elif "customer payment to small business to" in description.lower():
                # Extract the name after "Customer Payment to Small Business to"
                name = description.lower().split("customer payment to small business to")[1].strip().upper()
                return name
            elif "to" in description.lower():
                # Fallback: try to extract name after "to"
                parts = description.lower().split("to")
                if len(parts) > 1:
                    return parts[-1].strip().upper()
        
        # Extract only names for Received Money transactions
        if category == "Received Money":
            if "funds received from" in description.lower():
                # Extract the name after "Funds received from"
                name = description.lower().split("funds received from")[1].strip().upper()
                return name
            elif "received from" in description.lower():
                # Extract the name after "received from"
                name = description.lower().split("received from")[1].strip().upper()
                return name
            elif "from" in description.lower():
                # Fallback: try to extract name after "from"
                parts = description.lower().split("from")
                if len(parts) > 1:
                    return parts[-1].strip().upper()
        
        # Handle business payments
        if "business payment" in description.lower():
            match = re.search(r"from (.+?)(?:\s*$)", description, re.IGNORECASE)
            if match:
                return match.group(1).strip()
        
        # Handle bundle purchases
        if "bundle purchase" in description.lower():
            return "Safaricom Data Bundle"
        
        # Handle airtime purchases
        if "airtime purchase" in description.lower():
            return "Airtime Top-up"
        
        # For Pay Bill, extract account info if available
        if category == "Pay Bill" and "pay bill to" in description.lower():
            # Try to extract the account info
            parts = description.split("Pay Bill to")
            if len(parts) > 1:
                return parts[1].strip()
        
        # Clean up any remaining special characters or extra spaces
        cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", description)
        cleaned = re.sub(r"\s+", " ", cleaned).strip()
        return cleaned if cleaned else "NULL"

    def extract_transaction(row):
        date_time = row["completion time"].split(" ") if pd.notna(row["completion time"]) else ["", ""]
        date = date_time[0] if len(date_time) > 0 else ""
        time = ":".join(date_time[1].split(":")[:2]) if len(date_time) > 1 else ""
        
        description = clean_description(row["details"]) if pd.notna(row["details"]) else ""
        category = categorize_transaction(description)
        paid_to = extract_recipient(description, category)

        # Handle amounts correctly
        amount_in = float(row["paid in"]) if "paid in" in row and pd.notna(row["paid in"]) else 0.0
        amount_out = abs(float(row["withdrawn"])) if "withdrawn" in row and pd.notna(row["withdrawn"]) else 0.0

        # Special cases for amount handling
        if category in ["M-Shwari Withdrawal", "Received Money", "Bulk Payment Received"]:
            amount_out = 0.0
        elif category == "M-Shwari Deposit":
            amount_in = 0.0
        
        return date, time, category, paid_to, amount_in, amount_out, customer_name, mobile_number

    transactions_data = df.apply(extract_transaction, axis=1)

    transactions_df = pd.DataFrame(transactions_data.tolist(), columns=[
        "Date", "Time", "Category", "Paid To", "Amount In", "Amount Out", "User Name", "Mobile Number"
    ])

    # Clean up recipient names - remove hyphens
    transactions_df["Paid To"] = transactions_df["Paid To"].apply(
        lambda x: x.replace("- ", "").replace("-", "").strip() if isinstance(x, str) else x
    )

    # Clean up recipient names further
    transactions_df["Paid To"] = transactions_df["Paid To"].apply(
        lambda x: "NULL" if x is None or x == "" else x
    )

    # Convert amounts to proper numeric format
    transactions_df["Amount In"] = pd.to_numeric(transactions_df["Amount In"], errors='coerce').fillna(0.0)
    transactions_df["Amount Out"] = pd.to_numeric(transactions_df["Amount Out"], errors='coerce').fillna(0.0)
    
    transactions_df.to_csv("CleanedMpesaTransactions.csv", index=False)
    print("Cleaned transactions saved to CleanedMpesaTransactions.csv")

except Exception as e:
    print(f"ERROR: {e}")