from http.client import HTTPException
import json
from collections import defaultdict
from datetime import datetime, timedelta, date, time


def load_transactions(file_path):
    """Load transactions from JSON file"""
    try:
        with open(file_path) as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading transactions: {e}")
        return []

def generate_report(transactions):
    """Generate the exact JSON structure by analyzing transactions"""
    
    # Initialize all data structures
    report = {
        "results_page": {
            "essentials": {
                "total_spent": 0,
                "total_received": 0,
                "net_flow": 0,
                "top_month": {"month_name": "", "month_amount": 0},
                "categories": defaultdict(float)
            },
            "top_spending_habits": {
                "biggest_transactions": {"biggest_amount": 0, "biggest_date": "", "its_category": ""},
            "most_frequent_recepient": {
                "name": "",
                "frequency": 0,
                "amount": 0
            },
            "top_recepient": {
                "name": "",
                "amount": 0
            },
                "most_visited_paybill_or_till":{
                    "type": "",
                    "name": "",
                    "frequency": 0,
                    "amount": 0
                }
            },
            "time_based": {
                "most_active_day": {"date": "", "number_of_transactions": 0, "active_day_amount": 0},
                "inactive_days": {},
                "peak_transaction_period": {"period_name": "", "percentage": "0%"}
            }
        },
        "user_analytics_page": {
            "monthly_transactions": defaultdict(float),
            "most_frequent_recepients": {
                "recipient_1": {"recipient_name": "", "recipient_amount": 0, "frequency": 0},
                "recipient_2": {"recipient_name": "", "recipient_amount": 0, "frequency": 0},
                "recipient_3": {"recipient_name": "", "recipient_amount": 0, "frequency": 0},
                "recipient_4": {"recipient_name": "", "recipient_amount": 0, "frequency": 0},
                "recipient_5": {"recipient_name": "", "recipient_amount": 0, "frequency": 0}
            },
            "top_recepients": {},
            "transaction_periods": defaultdict(int),
            "fuliza": {"amount_borrowed": 0, "fuliza_fee": 0},
            "total_transaction_cost": 0,
            "number_of_inactive_days": 0,
            "airtime_and_bundles": 0,
            "mshwari": {
                "amount_in": 0,
                "amount_out": 0
            }
        }
    }

    # Helper variables
    daily_counts = defaultdict(int)
    daily_amounts = defaultdict(float)
    recipient_counts = defaultdict(int)
    recipient_amounts = defaultdict(float)
    paybill_till_amounts = defaultdict(float)
    paybill_till_counts = defaultdict(int) 
    paybill_till_type = defaultdict(str)
    time_period_counts = defaultdict(int)
    all_days = set()

    # Initialize date range for inactive days calculation
    if transactions:
        dates = [datetime.strptime(t['transaction_date'], "%Y-%m-%d").date() 
                for t in transactions if 'transaction_date' in t]
        if dates:
            min_date = min(dates)
            max_date = max(dates)
            current_date = min_date
            while current_date <= max_date:
                all_days.add(current_date.strftime("%Y-%m-%d"))
                current_date += timedelta(days=1)
    # Process each transaction
    for txn in transactions:
        try:
            date = txn.get('transaction_date', '')
            amount_out = float(txn.get('amount_out', 0))
            amount_in = float(txn.get('amount_in', 0))
            category = txn.get('category', '')
            recipient = (txn.get('paid_to') or '').strip()

            # Essentials
            report["results_page"]["essentials"]["total_spent"] += amount_out
            report["results_page"]["essentials"]["total_received"] += amount_in
            # Categorize spending 
            if category in ["Send Money", "Till Payment", "Pay Bill", "Pochi la Biashara"]:
                if category == "Till Payment":
                    report["results_page"]["essentials"]["categories"]["Till"] += amount_out
                elif category == "Pay Bill":
                    report["results_page"]["essentials"]["categories"]["Pay_Bill"] += amount_out
                elif category == "Pochi la Biashara":
                    report["results_page"]["essentials"]["categories"]["Pochi la Biashara"] += amount_out
                else:  # Send Money
                    report["results_page"]["essentials"]["categories"]["send_money"] += amount_out
            
            # Biggest transaction
            if amount_out > report["results_page"]["top_spending_habits"]["biggest_transactions"]["biggest_amount"]:
                report["results_page"]["top_spending_habits"]["biggest_transactions"] = {
                    "biggest_amount": amount_out,
                    "biggest_date": date,
                    "its_category": category
                }
            if category in "Send Money":
                # Recipient tracking
                if recipient:
                    recipient_counts[recipient] += 1
                    recipient_amounts[recipient] += amount_out
                    if category in ('Pay Bill', 'Till'):
                        paybill_till_amounts[recipient] += amount_out
            if category in ('Pay Bill', 'Till Payment') and recipient:
                # Extract merchant name (e.g., from "Merchant Payment VIVIAN ATIENO")
                merchant_name = recipient.replace("Merchant Payment", "").strip()
                
                paybill_till_counts[merchant_name] += 1
                paybill_till_amounts[merchant_name] += amount_out
                paybill_till_type[merchant_name] = category
            # Daily stats
            daily_counts[date] += 1
            daily_amounts[date] += amount_out
            
            # Time period analysis
            if 'transaction_time' in txn:
                try:
                    hour = int(txn['transaction_time'].split(':')[0])
                    if 0 <= hour < 6:
                        time_period = "early_morning"
                    elif 6 <= hour < 12:
                        time_period = "morning"
                    elif 12 <= hour < 17:
                        time_period = "afternoon"
                    elif 17 <= hour < 21:
                        time_period = "evening"
                    else:
                        time_period = "late_night"
                    time_period_counts[time_period] += 1
                    report["user_analytics_page"]["transaction_periods"][time_period] += 1
                except:
                    pass
            
            # Monthly transactions
            if date:
                month = datetime.strptime(date, "%Y-%m-%d").strftime("%B")
                report["user_analytics_page"]["monthly_transactions"][month] += amount_out
            
            # Fuliza detection (example logic)
            if "fuliza" in category.lower():
                report["user_analytics_page"]["fuliza"]["amount_borrowed"] += amount_out
                report["user_analytics_page"]["fuliza"]["fuliza_fee"] += amount_out * 0.1  # Assuming 10% fee
            
            # Transaction cost
            if category == "Send Money costs" or recipient == "Pay Bill Charge":
                report["user_analytics_page"]["total_transaction_cost"] += amount_out 
            
            #Airtime and bundles
            if "DATA BUNDLES" in recipient or "Airtime" in recipient:
                report["user_analytics_page"]["airtime_and_bundles"] += amount_out  

            #Mshwari               
            if "M-Shwari" in category:
                report["user_analytics_page"]["mshwari"]["amount_in"] += amount_in                
                report["user_analytics_page"]["mshwari"]["amount_out"] += amount_out                 
        except Exception as e:
            print(f"Error processing transaction: {txn}. Error: {e}")
            continue


                
    # Post-processing calculations
    
    # Net flow
    report["results_page"]["essentials"]["net_flow"] = (
        report["results_page"]["essentials"]["total_received"] - 
        report["results_page"]["essentials"]["total_spent"]
    )
    
    # Top month
    if report["user_analytics_page"]["monthly_transactions"]:
        top_month = max(report["user_analytics_page"]["monthly_transactions"].items(), 
                       key=lambda x: x[1])
        report["results_page"]["essentials"]["top_month"] = {
            "month_name": top_month[0],
            "month_amount": top_month[1]
        }
    
    # Most frequent recipient
    if recipient_counts:
        most_frequent_name = max(recipient_counts.items(), key=lambda x: x[1])[0]
        report["results_page"]["top_spending_habits"]["most_frequent_recepient"] = {
            "name": most_frequent_name,
            "frequency": recipient_counts[most_frequent_name],
            "amount": recipient_amounts[most_frequent_name]
        }
        # Find recipient with highest total amount
        top_recipient = max(recipient_amounts.items(), key=lambda x: x[1])
        
        report["results_page"]["top_spending_habits"]["top_recepient"] = {
            "name": top_recipient[0],  # Recipient name
            "amount": top_recipient[1],  # Total amount sent 
        }
    else:
        report["results_page"]["top_spending_habits"]["most_frequent_recepient"] = {
            "name": "",
            "frequency": 0,
            "amount": 0
        }
    # Most visited paybill/till
    if paybill_till_counts:
        most_visited_merchant = max(paybill_till_counts.items(), key=lambda x: x[1])[0]
        report["results_page"]["top_spending_habits"]["most_visited_paybill_or_till"] = {
            "type": paybill_till_type[most_visited_merchant],
            "name": most_visited_merchant,
            "frequency": paybill_till_counts[most_visited_merchant],
            "amount": paybill_till_amounts[most_visited_merchant]
        }
    
    # Most active day
    if daily_counts:
        active_date = max(daily_counts.items(), key=lambda x: x[1])
        report["results_page"]["time_based"]["most_active_day"] = {
            "date": active_date[0],
            "number_of_transactions": active_date[1],
            "active_day_amount": daily_amounts[active_date[0]]
        }
    
    # Inactive days (top 3)
    if all_days:
        inactive_days = sorted(list(all_days - set(daily_counts.keys())))
        for i, day in enumerate(inactive_days[:3], 1):
            report["results_page"]["time_based"]["inactive_days"][f"day_{i}"] = day
        if len(inactive_days) > 3:
            report["results_page"]["time_based"]["inactive_days"]["more_days_flag"] = "True"
    
    # Peak transaction period
    if time_period_counts:
        total_periods = sum(time_period_counts.values())
        peak_period = max(time_period_counts.items(), key=lambda x: x[1])
        percentage = int((peak_period[1] / total_periods) * 100)
        report["results_page"]["time_based"]["peak_transaction_period"] = {
            "period_name": peak_period[0].capitalize(),
            "percentage": f"{percentage}%"
        }

    # Top 5 recipients
    # Get top 5 recipients by frequency
    # Sort by frequency first, then by amount for ties
    top_recipients = sorted(recipient_counts.items(),
                          key=lambda x: (-x[1], -recipient_amounts[x[0]]))[:5]
    
    for i, (name, freq) in enumerate(top_recipients, 1):
        report["user_analytics_page"]["most_frequent_recepients"][f"recipient_{i}"] = {
            "recipient_name": name,
            "recipient_amount": round(recipient_amounts[name], 2),
            "frequency": freq
        }
    # Get top 5 recipients by frequency
    if recipient_amounts:
        # Get top 5 recipients by amount (descending order)
        top_by_amount = sorted(recipient_amounts.items(),
                            key=lambda x: (x[1]),
                            reverse=True)[:5]
        
        for i, (name, amount) in enumerate(top_by_amount, 1):
            report["user_analytics_page"]["top_recepients"][f"recipient_{i}"] = {
                "recipient_name": name,
                "recipient_amount": amount,
                "frequency": recipient_counts[name]  # Include frequency count
            }
    else:
        # Initialize empty structure if no recipients
        for i in range(1, 6):
            report["user_analytics_page"]["most_frequent_recepients"][f"recipient_{i}"] = {
                "recipient_name": "",
                "recipient_amount": 0,
                "frequency": 0
            }
    # Number of inactive days
    if all_days:
        report["user_analytics_page"]["number_of_inactive_days"] = len(all_days - set(daily_counts.keys()))
    
    # Convert defaultdicts to regular dicts
    report["results_page"]["essentials"]["categories"] = dict(report["results_page"]["essentials"]["categories"])
    report["user_analytics_page"]["monthly_transactions"] = dict(report["user_analytics_page"]["monthly_transactions"])
    report["user_analytics_page"]["transaction_periods"] = dict(report["user_analytics_page"]["transaction_periods"])
    return report

async def save_report_to_db(db, user_id, user_name, report_data):
    """Save the generated report to the database"""
    try:
        cur = db.cursor()
        
        # Check if report exists for this user
        cur.execute("""
            SELECT report_id FROM report_table 
            WHERE user_name = %s
        """, (user_name,))
        existing_report = cur.fetchone()
        
        if existing_report:
            # Update existing report
            cur.execute("""
                UPDATE report_table 
                SET report_data = %s, updated_at = CURRENT_TIMESTAMP, user_id = %s
                WHERE user_name = %s
                RETURNING report_id
            """, (json.dumps(report_data), user_id, user_name))
        else:
            # Insert new report
            cur.execute("""
                INSERT INTO report_table (user_id, user_name, report_data)
                VALUES (%s, %s, %s)
                RETURNING report_id
            """, (user_id, user_name, json.dumps(report_data)))
        
        db.commit()
        cur.close()
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error saving report to database: {str(e)}")
async  def report_maker(db, user_id, user_name):
    try:
        cur = db.cursor()
        sql = """
        SELECT user_name, transaction_date, transaction_time,
               category, paid_to, amount_in, amount_out
        FROM statement_table
        WHERE user_name = %s
        ORDER BY transaction_date DESC;
        """
        cur.execute(sql, (user_name,))
        rows = cur.fetchall()
        colnames = [desc[0] for desc in cur.description]
        cur.close()

        if not rows:
            raise ValueError("No transactions found")
        
        # Convert datetime.date and datetime.time to strings
        for row in rows:
            for key, value in row.items():
                if isinstance(value, (date, time)):
                    row[key] = value.isoformat()

        # Save transactions to JSON
        # with open("transactions.json", "w") as f:
        #     json.dump(rows, f, indent=4)

        # Convert rows to list of dicts and convert date objects to strings
        transactions = []
        for row in rows:
            # Convert the RealDictRow to a regular dict
            txn = dict(row)
            
            # Check if transaction_date is a date object and convert to string
            if 'transaction_date' in txn:
                # Use explicit date type check
                if hasattr(txn['transaction_date'], 'strftime'):  # A safer way to check
                    txn['transaction_date'] = txn['transaction_date'].strftime('%Y-%m-%d')
                else:
                    # If it's not a date object with strftime method, convert to string
                    txn['transaction_date'] = str(txn['transaction_date'])
            
            transactions.append(txn)
        
        # Generate report
        report = generate_report(transactions)
        
        # Save report to file
        # with open("report.json", "w") as f:
        #     json.dump(report, f, indent=2)
        
        # Save to database
        report_id = await save_report_to_db(db, user_id, user_name, report)
        if not report_id:
            raise Exception("Failed to save report to database")         

        return "Report generated and saved to report_table successfully"
    except Exception as e:
        return f"Error generating report {e}"