import json
from collections import defaultdict
from datetime import datetime
import heapq
import os

def load_transactions(file_path):
    """Load transactions from JSON file and add datetime objects"""
    try:
        with open(file_path) as f:
            transactions = json.load(f)
        
        for txn in transactions:
            # Add datetime object for easier time-based operations
            txn['datetime'] = datetime.strptime(
                f"{txn['transaction_date']} {txn['transaction_time']}", 
                "%Y-%m-%d %H:%M:%S"
            )
        return transactions
    except FileNotFoundError:
        print(f"Error: File '{file_path}' not found. Please ensure it exists in the same directory as this script.")
        return []
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON format in '{file_path}'. Please validate your JSON data.")
        return []

def generate_time_frame_report(transactions, time_frame='monthly'):
    """Generate report grouped by time frame (daily, weekly, monthly)"""
    time_frame_reports = defaultdict(lambda: {'total_spent': 0, 'count': 0})
    
    for txn in transactions:
        if txn['amount_out'] <= 0:
            continue
            
        date = txn['datetime']
        if time_frame == 'daily':
            key = date.strftime('%Y-%m-%d')
        elif time_frame == 'weekly':
            key = f"{date.year}-{date.isocalendar().week}"
        else:  # monthly
            key = date.strftime('%Y-%m')
        
        time_frame_reports[key]['total_spent'] += txn['amount_out']
        time_frame_reports[key]['count'] += 1
    
    return dict(time_frame_reports)

def generate_comprehensive_report(transactions):
    """Generate all required analytics without database queries"""
    metrics = {
        'essentials': {
            'total_spent': 0,
            'total_received': 0,
            'net_flow': 0,
            'category_spending': defaultdict(float)
        },
        'spending_habits': {
            'biggest_transaction': None,
            'most_frequent_recipient': ("", 0),
            'most_visited_paybill_or_till': ("", 0)
        },
        'time_insights': {
            'most_active_day': ("", 0),
            'inactive_days': [],
            'peak_transaction_times': {
                'Early Morning (12am-6am)': 0,
                'Morning (6am-12pm)': 0,
                'Afternoon (12pm-5pm)': 0,
                'Evening (5pm-9pm)': 0,
                'Late Night (9pm-12am)': 0
            }
        },
        'existing_metrics': {
            'top_3_transactions': [],
            'top_5_days': [],
            'annual_lipa_na_mpesa': 0,
            'most_frequent_category': ("", 0),
            'top_3_months': [],
            'airtime_bundles_total': 0
        }
    }
    
    daily_counts = defaultdict(int)
    monthly_counts = defaultdict(int)
    category_counts = defaultdict(int)
    recipient_counts = defaultdict(int)
    paybill_till_counts = defaultdict(int)
    top_transactions = []
    inactive_days = set()
    all_days = set()
    
    # Initialize date range
    if transactions:
        start_date = min(txn['datetime'] for txn in transactions)
        end_date = max(txn['datetime'] for txn in transactions)
        current_date = start_date.date()
        while current_date <= end_date.date():
            all_days.add(current_date.strftime('%Y-%m-%d'))
            current_date += timedelta(days=1)
    
    for txn in transactions:
        # Essentials calculations
        metrics['essentials']['total_spent'] += txn['amount_out']
        metrics['essentials']['total_received'] += txn['amount_in']
        metrics['essentials']['category_spending'][txn['category']] += txn['amount_out']
        
        # Count transactions per day
        day_key = txn['transaction_date']
        daily_counts[day_key] += 1
        
        # Count transactions per month
        month_key = txn['datetime'].strftime('%Y-%m')
        monthly_counts[month_key] += 1
        
        # Track category frequency
        category_counts[txn['category']] += 1
        
        # Track recipient frequency
        if 'paid_to' in txn:
            recipient_counts[txn['paid_to']] += 1
        
        # Track Pay Bill/Till frequency
        if txn['category'] in ('Pay Bill', 'Till Number'):
            paybill_till_counts[txn.get('paid_to', 'N/A')] += 1
        
        # Track top transactions
        if txn['amount_out'] > 0:
            # Track biggest transaction
            if (metrics['spending_habits']['biggest_transaction'] is None or 
                txn['amount_out'] > metrics['spending_habits']['biggest_transaction']['amount_out']):
                metrics['spending_habits']['biggest_transaction'] = txn
            
            # Store only the amount and index to avoid comparing dictionaries
            if len(top_transactions) < 3:
                heapq.heappush(top_transactions, (txn['amount_out'], len(top_transactions)))
            else:
                heapq.heappushpop(top_transactions, (txn['amount_out'], len(top_transactions)))
            
            # Sum Lipa na M-Pesa (Pay Bill)
            if txn['category'] == 'Pay Bill':
                metrics['existing_metrics']['annual_lipa_na_mpesa'] += txn['amount_out']
            
            # Sum airtime and bundles
            if txn['category'] in ('Bundle Purchase', 'Airtime Purchase'):
                metrics['existing_metrics']['airtime_bundles_total'] += txn['amount_out']
        
        # Time-based insights
        hour = txn['datetime'].hour
        if 0 <= hour < 6:
            metrics['time_insights']['peak_transaction_times']['Early Morning (12am-6am)'] += 1
        elif 6 <= hour < 12:
            metrics['time_insights']['peak_transaction_times']['Morning (6am-12pm)'] += 1
        elif 12 <= hour < 17:
            metrics['time_insights']['peak_transaction_times']['Afternoon (12pm-5pm)'] += 1
        elif 17 <= hour < 21:
            metrics['time_insights']['peak_transaction_times']['Evening (5pm-9pm)'] += 1
        else:
            metrics['time_insights']['peak_transaction_times']['Late Night (9pm-12am)'] += 1
    
    # Calculate net flow
    metrics['essentials']['net_flow'] = (
        metrics['essentials']['total_received'] - metrics['essentials']['total_spent']
    )
    
    # Prepare final metrics
    # Sort the transactions by amount and get the top 3
    top_transactions_sorted = sorted(top_transactions, reverse=True)[:3]
    metrics['existing_metrics']['top_3_transactions'] = [transactions[i] for (amt, i) in top_transactions_sorted]
    
    metrics['existing_metrics']['top_5_days'] = sorted(daily_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    
    # Most active day
    if daily_counts:
        metrics['time_insights']['most_active_day'] = max(daily_counts.items(), key=lambda x: x[1])
    
    # Inactive days (up to 3)
    inactive_days = all_days - set(daily_counts.keys())
    metrics['time_insights']['inactive_days'] = sorted(list(inactive_days))[:3]
    
    if category_counts:
        metrics['existing_metrics']['most_frequent_category'] = max(category_counts.items(), key=lambda x: x[1])
    
    if recipient_counts:
        metrics['spending_habits']['most_frequent_recipient'] = max(recipient_counts.items(), key=lambda x: x[1])
    
    if paybill_till_counts:
        metrics['spending_habits']['most_visited_paybill_or_till'] = max(paybill_till_counts.items(), key=lambda x: x[1])
    
    metrics['existing_metrics']['top_3_months'] = sorted(monthly_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return metrics

def format_report(report, output_format='json', time_frame=None):
    """Format the report for CLI or JSON output"""
    if output_format == 'cli':
        if 'existing_metrics' in report:  # Comprehensive report
            output = [
                "\nCOMPREHENSIVE TRANSACTION REPORT",
                "=" * 40,
                "\nESSENTIALS:",
                f"Total Spent: KES {report['essentials']['total_spent']:,.2f}",
                f"Total Received: KES {report['essentials']['total_received']:,.2f}",
                f"Net Flow: KES {report['essentials']['net_flow']:,.2f}",
                "\nCategory Spending:"
            ]
            
            for category, amount in report['essentials']['category_spending'].items():
                output.append(f"  {category}: KES {amount:,.2f}")
            
            output.extend([
                "\nSPENDING HABITS:",
                f"Biggest Transaction: KES {report['spending_habits']['biggest_transaction']['amount_out']:,.2f} "
                f"({report['spending_habits']['biggest_transaction']['category']})",
                f"Most Frequent Recipient: {report['spending_habits']['most_frequent_recipient'][0]} "
                f"({report['spending_habits']['most_frequent_recipient'][1]} times)",
                f"Most Visited Pay Bill/Till: {report['spending_habits']['most_visited_paybill_or_till'][0]} "
                f"({report['spending_habits']['most_visited_paybill_or_till'][1]} times)",
                
                "\nTIME-BASED INSIGHTS:",
                f"Most Active Day: {report['time_insights']['most_active_day'][0]} "
                f"({report['time_insights']['most_active_day'][1]} transactions)",
                "Inactive Days:",
                *[f"  {day}" for day in report['time_insights']['inactive_days']],
                "\nPeak Transaction Times:"
            ])
            
            for time_frame, count in report['time_insights']['peak_transaction_times'].items():
                output.append(f"  {time_frame}: {count} transactions")
            
            output.extend([
                "\nEXISTING METRICS:",
                "\nTop 3 Transactions:"
            ])
            
            for i, txn in enumerate(report['existing_metrics']['top_3_transactions'], 1):
                output.append(
                    f"{i}. {txn['category']} to {txn.get('paid_to', 'N/A')}: "
                    f"KES {txn['amount_out']:,.2f} on {txn['transaction_date']}"
                )
            
            output.extend([
                "\nTop 5 Days by Transaction Count:",
                *[f"{i}. {day}: {count} txns" 
                  for i, (day, count) in enumerate(report['existing_metrics']['top_5_days'], 1)],
                f"\nAnnual Lipa na M-Pesa: KES {report['existing_metrics']['annual_lipa_na_mpesa']:,.2f}",
                f"Most Frequent Category: {report['existing_metrics']['most_frequent_category'][0]} "
                f"({report['existing_metrics']['most_frequent_category'][1]} times)",
                f"\nTop 3 Months:",
                *[f"{i}. {month}: {count} txns" 
                  for i, (month, count) in enumerate(report['existing_metrics']['top_3_months'], 1)],
                f"\nAirtime & Bundles Total: KES {report['existing_metrics']['airtime_bundles_total']:,.2f}"
            ])
            return "\n".join(output)
        else:  # Time frame report
            if time_frame is None:
                time_frame = "PERIOD"
            output = [f"\n{time_frame.upper()} REPORT", "=" * 40]
            for period, data in report.items():
                output.append(
                    f"{period}: {data['count']} transactions, "
                    f"KES {data['total_spent']:,.2f} spent"
                )
            return "\n".join(output)
    else:
        return json.dumps(report, indent=2, default=str)

if __name__ == "__main__":
    # Get the directory where the script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_file = os.path.join(script_dir, 'transactions.json')
    
    transactions = load_transactions(json_file)
    
    if not transactions:
        print("No transactions loaded. Exiting.")
        exit(1)
    
    # Generate reports
    daily_report = generate_time_frame_report(transactions, 'daily')
    monthly_report = generate_time_frame_report(transactions, 'monthly')
    comprehensive_report = generate_comprehensive_report(transactions)
    
    # Print sample outputs
    print("DAILY REPORT (CLI):")
    print(format_report(daily_report, 'cli', 'daily'))
    
    print("\nMONTHLY REPORT (CLI):")
    print(format_report(monthly_report, 'cli', 'monthly'))
    
    print("\nCOMPREHENSIVE REPORT (JSON):")
    print(format_report(comprehensive_report, 'json'))
