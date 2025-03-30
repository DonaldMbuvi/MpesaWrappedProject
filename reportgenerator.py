import json
import sqlite3
from datetime import datetime
from collections import Counter

# 1. SQL Queries for total spending per category (optimized)
def setup_database(transactions):
    conn = sqlite3.connect(':memory:')
    cursor = conn.cursor()
    
    # Create optimized table with indexes
    cursor.execute('''
    CREATE TABLE transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_name TEXT,
        mobile_number TEXT,
        transaction_date DATE,
        transaction_time TIME,
        category TEXT,
        paid_to TEXT,
        amount_in REAL,
        amount_out REAL,
        full_datetime DATETIME
    )
    ''')
    
    # Create indexes for performance
    cursor.execute('CREATE INDEX idx_category ON transactions(category)')
    cursor.execute('CREATE INDEX idx_date ON transactions(transaction_date)')
    cursor.execute('CREATE INDEX idx_datetime ON transactions(full_datetime)')
    
    # Insert data with combined datetime for better date operations
    for t in transactions:
        full_datetime = f"{t['transaction_date']} {t['transaction_time']}"
        cursor.execute('''
        INSERT INTO transactions 
        (user_name, mobile_number, transaction_date, transaction_time, 
         category, paid_to, amount_in, amount_out, full_datetime)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            t['user_name'], t['mobile_number'], t['transaction_date'], 
            t['transaction_time'], t['category'], t['paid_to'], 
            t['amount_in'], t['amount_out'], full_datetime
        ))
    
    conn.commit()
    return conn

# 2. Report generation functions
def generate_report(conn, time_frame='monthly'):
    cursor = conn.cursor()
    
    # Determine date format based on time frame
    if time_frame == 'daily':
        date_format = '%Y-%m-%d'
        group_by = 'transaction_date'
    elif time_frame == 'weekly':
        date_format = '%Y-%W'
        group_by = "strftime('%Y-%W', transaction_date)"
    else:  # monthly
        date_format = '%Y-%m'
        group_by = "strftime('%Y-%m', transaction_date)"
    
    # Optimized query for time frame report
    cursor.execute(f'''
    SELECT 
        {group_by} as period,
        SUM(amount_out) as total_spent,
        COUNT(*) as transaction_count
    FROM transactions
    WHERE amount_out > 0
    GROUP BY period
    ORDER BY period
    ''')
    
    results = cursor.fetchall()
    
    report = {
        'time_frame': time_frame,
        'periods': [{
            'period': row[0],
            'total_spent': row[1],
            'transaction_count': row[2]
        } for row in results]
    }
    
    return report

def generate_comprehensive_report(conn):
    cursor = conn.cursor()
    
    # 1. 3 highest transactions
    cursor.execute('''
    SELECT category, paid_to, amount_out, transaction_date, transaction_time
    FROM transactions
    WHERE amount_out > 0
    ORDER BY amount_out DESC
    LIMIT 3
    ''')
    top_transactions = [{
        'category': row[0],
        'paid_to': row[1],
        'amount': row[2],
        'date': row[3],
        'time': row[4]
    } for row in cursor.fetchall()]
    
    # 2. Top 5 days with most transactions
    cursor.execute('''
    SELECT 
        transaction_date,
        COUNT(*) as transaction_count
    FROM transactions
    GROUP BY transaction_date
    ORDER BY transaction_count DESC
    LIMIT 5
    ''')
    top_days = [{
        'date': row[0],
        'transaction_count': row[1]
    } for row in cursor.fetchall()]
    
    # 3. Annual amount spent on Lipa na M-Pesa (assuming this is Pay Bill category)
    cursor.execute('''
    SELECT SUM(amount_out) as total
    FROM transactions
    WHERE category = 'Pay Bill'
    ''')
    lipa_na_mpesa_total = cursor.fetchone()[0] or 0
    
    # 4. Most frequent transactions (categories)
    cursor.execute('''
    SELECT category, COUNT(*) as frequency
    FROM transactions
    GROUP BY category
    ORDER BY frequency DESC
    LIMIT 1
    ''')
    most_frequent = cursor.fetchone()
    
    # 5. Top 3 months by transaction count
    cursor.execute('''
    SELECT 
        strftime('%Y-%m', transaction_date) as month,
        COUNT(*) as transaction_count
    FROM transactions
    GROUP BY month
    ORDER BY transaction_count DESC
    LIMIT 3
    ''')
    top_months = [{
        'month': row[0],
        'transaction_count': row[1]
    } for row in cursor.fetchall()]
    
    # 6. Amount spent on airtime and bundles
    cursor.execute('''
    SELECT SUM(amount_out) as total
    FROM transactions
    WHERE category IN ('Bundle Purchase', 'Airtime Purchase')
    ''')
    airtime_bundles_total = cursor.fetchone()[0] or 0
    
    report = {
        'top_3_transactions': top_transactions,
        'top_5_days': top_days,
        'annual_lipa_na_mpesa': lipa_na_mpesa_total,
        'most_frequent_category': {
            'category': most_frequent[0],
            'count': most_frequent[1]
        },
        'top_3_months': top_months,
        'airtime_bundles_total': airtime_bundles_total
    }
    
    return report

# 3. Formatting functions
def format_json_report(report):
    return json.dumps(report, indent=2)

def format_cli_report(report):
    if 'time_frame' in report:  # Time frame report
        output = []
        output.append(f"\n{'='*40}")
        output.append(f"{report['time_frame'].upper()} TRANSACTION REPORT")
        output.append(f"{'='*40}")
        for period in report['periods']:
            output.append(f"{period['period']}:")
            output.append(f"  Total spent: KES {period['total_spent']:,.2f}")
            output.append(f"  Transactions: {period['transaction_count']}")
        return '\n'.join(output)
    else:  # Comprehensive report
        output = []
        output.append(f"\n{'='*40}")
        output.append("COMPREHENSIVE TRANSACTION ANALYSIS")
        output.append(f"{'='*40}")
        
        output.append("\nTOP 3 TRANSACTIONS:")
        for i, trans in enumerate(report['top_3_transactions'], 1):
            output.append(f"{i}. {trans['category']} to {trans['paid_to']}")
            output.append(f"   Amount: KES {trans['amount']:,.2f}")
            output.append(f"   Date: {trans['date']} at {trans['time']}")
        
        output.append("\nTOP 5 DAYS BY TRANSACTION COUNT:")
        for i, day in enumerate(report['top_5_days'], 1):
            output.append(f"{i}. {day['date']}: {day['transaction_count']} transactions")
        
        output.append(f"\nANNUAL LIPA NA M-PESA: KES {report['annual_lipa_na_mpesa']:,.2f}")
        output.append(f"MOST FREQUENT CATEGORY: {report['most_frequent_category']['category']} ({report['most_frequent_category']['count']} times)")
        
        output.append("\nTOP 3 MONTHS BY TRANSACTION COUNT:")
        for i, month in enumerate(report['top_3_months'], 1):
            output.append(f"{i}. {month['month']}: {month['transaction_count']} transactions")
        
        output.append(f"\nTOTAL ON AIRTIME & BUNDLES: KES {report['airtime_bundles_total']:,.2f}")
        
        return '\n'.join(output)

# Main execution
if __name__ == "__main__":
    # Load the initial JSON data
    with open('transactions.json') as f:
        transactions = json.load(f)
    
    # Set up the database
    conn = setup_database(transactions)
    
    # Generate reports
    daily_report = generate_report(conn, 'daily')
    weekly_report = generate_report(conn, 'weekly')
    monthly_report = generate_report(conn, 'monthly')
    comprehensive_report = generate_comprehensive_report(conn)
    
    # Print sample reports
    print("\nDAILY REPORT (JSON):")
    print(format_json_report(daily_report))
    
    print("\nWEEKLY REPORT (CLI):")
    print(format_cli_report(weekly_report))
    
    print("\nCOMPREHENSIVE REPORT (JSON):")
    print(format_json_report(comprehensive_report))
    
    # Close connection
    conn.close()