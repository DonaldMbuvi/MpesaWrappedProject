import pandas as pd
from datetime import datetime, timedelta
import random

def generate_report(transactions, period="daily"):
    df = pd.DataFrame(transactions)
    df["Date"] = pd.to_datetime(df["Date"])
    df = df[df["Amount Out"] > 0]  # Filter only outgoing transactions
    
    if period == "daily":
        report = df.groupby("Date")["Amount Out"].sum().reset_index()
    elif period == "weekly":
        df["Week"] = df["Date"].dt.to_period("W").apply(lambda r: r.start_time)
        report = df.groupby("Week")["Amount Out"].sum().reset_index()
    elif period == "monthly":
        df["Month"] = df["Date"].dt.to_period("M").apply(lambda r: r.start_time)
        report = df.groupby("Month")["Amount Out"].sum().reset_index()
    else:
        raise ValueError("Invalid period. Choose from: daily, weekly, monthly")
    
    return report.to_json(orient="records")  # JSON output

# Example SQL query for total spending per category
SQL_QUERY = """
SELECT Category, SUM("Amount Out") AS Total_Spending
FROM transactions
WHERE "Amount Out" > 0
GROUP BY Category
ORDER BY Total_Spending DESC;
"""

# Generate random transaction data
names = [
    "Julius Cherotich", "Alice Wanjiru", "Kevin Otieno", "David Kimani", "Sarah Njeri", "Peter Mwangi", "Grace Akinyi", "John Kiprono", "Mercy Chebet", "James Oduor", "Nancy Atieno", "Paul Ndungu", "Catherine Wairimu", "Daniel Mutua", "Linet Jepkemoi", "Samuel Kariuki", "Esther Wafula", "Joseph Mwangi", "Caroline Nduku", "Andrew Njuguna", "Susan Achieng", "Felix Kiprotich", "Beatrice Mwende", "Moses Omondi", "Christine Njeri", "Eric Kamau", "Anne Wambui", "Robert Otieno", "Joyce Nduta"
]

phone_numbers = [
    "254729001234", "254710567890", "254722345678", "254733987654", "254740112233", "254750223344", "254760334455", "254770445566", 
    "254780556677", "254790667788", "254791778899", "254792889900", "254793990011", "254794001122", "254795112233", "254796223344", 
    "254797334455", "254798445566", "254799556677", "254720667788", "254721778899", "254722889900", "254723990011", "254724001122", 
    "254725112233", "254726223344", "254727334455", "254728445566", "254729556677", "254730667788"
]

categories = ["Pay Bill", "M-Shwari Deposit", "Send Money", "Send Money costs", "Airtime Purchase", "Withdraw", "Shopping"]

def generate_transactions(num=200):
    transactions = []
    start_date = datetime(2025, 1, 1)
    for _ in range(num):
        date = start_date + timedelta(days=random.randint(0, 60))
        amount_out = round(random.uniform(5, 5000), 2)
        category = random.choice(categories)
        user_index = random.randint(0, len(names) - 1)
        transactions.append({
            "Date": date.strftime("%Y-%m-%d"),
            "Time": date.strftime("%H:%M"),
            "Transaction Type": f"{category} Transaction",
            "Amount In": 0,
            "Amount Out": amount_out,
            "Category": category,
            "User Name": names[user_index],
            "Mobile Number": phone_numbers[user_index]
        })
    return transactions

# Generate sample transactions
data = generate_transactions(200)

# Example usage
if __name__ == "__main__":
    print(generate_report(data, period="daily"))