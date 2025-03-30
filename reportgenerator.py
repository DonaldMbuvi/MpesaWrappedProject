import json
from collections import defaultdict
from datetime import datetime, timedelta
import heapq

def load_transactions(file_path):
    """Load transactions from JSON file and add datetime objects"""
    with open(file_path) as f:
        transactions = json.load(f)
    
    for txn in transactions:
        # Add datetime object for easier time-based operations
        txn['datetime'] = datetime.strptime(
            f"{txn['transaction_date']} {txn['transaction_time']}", 
            "%Y-%m-%d %H:%M:%S"
        )
    return transactions

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
    # Initialize metrics
    metrics = {
        'top_3_transactions': [],
        'top_5_days': [],
        'annual_lipa_na_mpesa': 0,
        'category_frequency': defaultdict(int),
        'monthly_counts': defaultdict(int),
        'airtime_bundles_total': 0
    }
    
    # Temporary storage for calculations
    daily_counts = defaultdict(int)
    monthly_counts = defaultdict(int)
    category_counts = defaultdict(int)
    top_transactions = []
    
    for txn in transactions:
        # Count transactions per day
        day_key = txn['transaction_date']
        daily_counts[day_key] += 1
        
        # Count transactions per month
        month_key = txn['datetime'].strftime('%Y-%m')
        monthly_counts[month_key] += 1
        
        # Track category frequency
        category_counts[txn['category']] += 1
        
        # Track top transactions (using min-heap for efficiency)
        if txn['amount_out'] > 0:
            if len(top_transactions) < 3:
                heapq.heappush(top_transactions, (txn['amount_out'], txn))
            else:
                heapq.heappushpop(top_transactions, (txn['amount_out'], txn))
            
            # Sum Lipa na M-Pesa (Pay Bill)
            if txn['category'] == 'Pay Bill':
                metrics['annual_lipa_na_mpesa'] += txn['amount_out']
            
            # Sum airtime and bundles
            if txn['category'] in ('Bundle Purchase', 'Airtime Purchase'):
                metrics['airtime_bundles_total'] += txn['amount_out']
    
    # Prepare final metrics
    metrics['top_3_transactions'] = [txn for (amt, txn) in sorted(top_transactions, reverse=True)]
    metrics['top_5_days'] = sorted(daily_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    metrics['most_frequent_category'] = max(category_counts.items(), key=lambda x: x[1])
    metrics['top_3_months'] = sorted(monthly_counts.items(), key=lambda x: x[1], reverse=True)[:3]
    
    return metrics

def format_report(report, output_format='json'):
    """Format the report for CLI or JSON output"""
    if output_format == 'cli':
        if 'top_3_transactions' in report:  # Comprehensive report
            output = [
                "\nCOMPREHENSIVE TRANSACTION REPORT",
                "=" * 40,
                "\nTop 3 Transactions:"
            ]
            for i, txn in enumerate(report['top_3_transactions'], 1):
                output.append(
                    f"{i}. {txn['category']} to {txn.get('paid_to', 'N/A')}: "
                    f"KES {txn['amount_out']:,.2f} on {txn['transaction_date']}"
                )
            
            output.extend([
                "\nTop 5 Days by Transaction Count:",
                *[f"{i}. {day}: {count} txns" 
                  for i, (day, count) in enumerate(report['top_5_days'], 1)],
                f"\nAnnual Lipa na M-Pesa: KES {report['annual_lipa_na_mpesa']:,.2f}",
                f"Most Frequent Category: {report['most_frequent_category'][0]} "
                f"({report['most_frequent_category'][1]} times)",
                f"\nTop 3 Months:",
                *[f"{i}. {month}: {count} txns" 
                  for i, (month, count) in enumerate(report['top_3_months'], 1)],
                f"\nAirtime & Bundles Total: KES {report['airtime_bundles_total']:,.2f}"
            ])
            return "\n".join(output)
        else:  # Time frame report
            output = [f"\n{time_frame.upper()} REPORT", "=" * 40]
            for period, data in report.items():
                output.append(
                    f"{period}: {data['count']} transactions, "
                    f"KES {data['total_spent']:,.2f} spent"
                )
            return "\n".join(output)
    else:
        return json.dumps(report, indent=2, default=str)

# Example Usage
if __name__ == "__main__":
    # Load and process data
    transactions = load_transactions('transactions.json')
    
    # Generate reports
    daily_report = generate_time_frame_report(transactions, 'daily')
    monthly_report = generate_time_frame_report(transactions, 'monthly')
    comprehensive_report = generate_comprehensive_report(transactions)
    
    # Print sample outputs
    print("DAILY REPORT (CLI):")
    print(format_report(daily_report, 'cli'))
    
    print("\nCOMPREHENSIVE REPORT (JSON):")
    print(format_report(comprehensive_report, 'json'))
