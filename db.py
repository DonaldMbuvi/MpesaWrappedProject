import psycopg2
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
def insert_transaction(customer_id, amount, category):
    conn=get_db_connection()
    cur=conn.cursor()
    sql="""
    INSERT INTO transactions (customer_id, amount, category)
    VALUES (%s, %s, %s) 
    RETURNING id;
    """
    cur.execute(sql, (customer_id, amount, category))
    transaction_id= cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    print(f"Transaction {transaction_id} added successfully!")

def get_transactions(customer_id):
    conn=get_db_connection()
    cur=conn.cursor()
    sql = "SELECT * FROM transactions WHERE customer_id = %s ORDER BY transaction_date DESC;"
    cur.execute(sql, (customer_id,))
    transactions = cur.fetchall()
    cur.close()
    conn.close()
    return transactions

def generate_spending_reports(customer_id):
    conn=get_db_connection()
    cur=conn.cursor()
    sql="""
    SELECT category, SUM(amount) as total_spent
    FROM transactions
    WHERE customer_id=%s
    GROUP BY category
    ORDER BY total_spent DESC;
    """
    cur.execute(sql, (customer_id,))
    report=cur.fetchall()

    cur.close()
    conn.close()
    return report

def output_fn():
    from db import insert_transaction, get_transactions, generate_spending_reports
    #Insert test transactions
    insert_transaction(customer_id=3, amount=500, category="Transport") 
    insert_transaction(customer_id=4, amount=1000, category="Food")
    insert_transaction(customer_id=3, amount=1500, category="Shopping")

    #Fetch transactions
    transactions = get_transactions(customer_id=3)
    print("Transactions:", transactions)

    #Generate report
    report = generate_spending_reports(customer_id=3)
    print("Spending report:", report)

output_fn()


