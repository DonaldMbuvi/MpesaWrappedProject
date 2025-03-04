import psycopg2
import pandas as pd
#Database connection settings
db_name="Mpesawrapped"
db_user="postgres"
db_password="Donald2004"
db_host="localhost"
db_port="5432"
#Function for database connection
def get_db_connection():
    conn = psycopg2.connect(
        database=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port
    )
    return conn

def create_table():
    conn=get_db_connection()
    cur=conn.cursor()
    sql="""CREATE TABLE IF NOT EXISTS transactions(
        id SERIAL PRIMARY KEY, 
        customer_name VARCHAR(255),
        mobile_number VARCHAR(20),
        transaction_id VARCHAR(20) UNIQUE,
        date DATE,
        time TIME,
        transaction_type TEXT,
        amount DECIMAL(10,2),
        category TEXT
        )"""
    cur.execute(sql)
    conn.commit()
    cur.close()
    conn.close()
    print("Database table checked/Created successfully. ")
    
    
def insert_transactions_from_csv(csv_file):
    conn=get_db_connection()
    curr=conn.cursor()
    df=pd.read_csv(csv_file)
    
    for index,row in df.iterrows():
        sql="""
        INSERT INTO transactions(customer_name, mobile_number, transaction_id, date,time,transaction_type, amount, category)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) 
        ON CONFLICT(transaction_id) DO NOTHING;
        """
        curr.execute(sql,(
            row["Customer Name"], 
            row["Mobile Number"], 
            row["TransactionID"], 
            row["Date"], 
            row["Time"], 
            row["Transaction Type"], 
            row["Amount"], 
            row["Category"]
        ))
    conn.commit()
    curr.close()
    conn.close()
    print(f"Transactions from{csv_file} inserted into database")

def get_transactions():
    conn=get_db_connection()
    cur=conn.cursor()
    sql = "SELECT * FROM transactions ORDER BY date DESC, time DESC;"
    cur.execute(sql)
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    return transactions

def generate_spending_reports():
    conn=get_db_connection()
    cur=conn.cursor()
    sql="""
    SELECT customer_name, category, SUM(amount) AS total_spent
    FROM transactions
    GROUP BY customer_name, category
    ORDER BY total_spent DESC;
    """
    cur.execute(sql)
    report=cur.fetchall()

    cur.close()
    conn.close()
    return report

def output_fn():
    create_table()
    insert_transactions_from_csv("CleanedMpesaTransactions.csv")

    transactions= get_transactions()
    print("ALL TRANSACTIONS: ", transactions)
    report=generate_spending_reports()
    print("Spending reports: ", report)
output_fn()

