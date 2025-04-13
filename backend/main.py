from io import StringIO
import json
import psycopg2
from database import get_db_connection
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Query
import csv
from  models import CREATE_STATEMENT_TABLE
from database import get_db
from pypdf import PdfReader
from pdf_to_csv import convert_pdf_to_csv

# Initialize FastAPI app
app = FastAPI()

# Create database table upon start up if they don't exist
@app.on_event("startup")
def create_tables():
    db = get_db_connection()
    cur = db.cursor()
    cur.execute(CREATE_STATEMENT_TABLE)
    db.commit()
    cur.close()
    db.close()


# API endpoint to save a statement to the database
@app.post("/upload-pdf/")
def upload_csv_and_save_to_db(db: psycopg2.extensions.connection = Depends(get_db), pdf_file: UploadFile = File(...)):
    
    cleaned_csv_content = convert_pdf_to_csv(pdf_file)
    if not cleaned_csv_content :
        raise HTTPException(status_code=400, detail="Failed to convert PDF to CSV")

    try:
        # Split the CSV content into lines
        csv_data = cleaned_csv_content.splitlines()
        #read csv data
        csv_reader = csv.reader(csv_data)
        next(csv_reader)  # Skip the header row
        cur = db.cursor()
        #store csv data in mysql
        # For each row in the CSV, insert into the database
        for row in csv_reader:
            sql = """
            INSERT INTO statement_table (user_name, mobile_number, transaction_date, transaction_time, 
                                        category, paid_to, amount_in, amount_out)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
            """
            try:
                # Parse the date and time
                transaction_date = row[0]  # '2025-02-27'
                transaction_time = row[1]  # '12:17'
                category = row[2]  # 'Pay Bill'
                paid_to = row[3] if row[3] != 'NULL' else None  # Handle NULL values
                
                # Parse amounts and convert to integers
                amount_in = int(float(row[4].replace(',', ''))) if row[4] and row[4] != '0' else 0
                amount_out = int(float(row[5].replace(',', ''))) if row[5] and row[5] != '0' else 0
                
                user_name = row[6]  # 'Julius Cherotich'
                mobile_number = row[7]  # '254729008219'
                
                # Execute the SQL with the correct parameters
                cur.execute(sql, (user_name, mobile_number, transaction_date, transaction_time,
                                category, paid_to, amount_in, amount_out))
            except (ValueError, IndexError) as e:
                print(f"Error processing row {row}: {e}")
                continue
        db.commit()
        cur.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSVv: {str(e)}")
    get_transactions(db, user_name)
    return "message: Transactions uploaded and saved in Json format successfully"


# A function for getting the saved transactions
def get_transactions(db, user_name):
    cur = db.cursor()
    sql = """SELECT user_name, mobile_number, transaction_date, transaction_time, category, paid_to, amount_in, amount_out FROM statement_table WHERE user_name = %s ORDER BY transaction_date DESC;"""
    cur.execute(sql, (user_name,))
    transactions = cur.fetchall()
    cur.close()

    
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this user") 

    #save the statement in json file
    with open("user_statement.json", "w") as file:
        json.dump(transactions, file, indent=4, default=str)
    return "transaction saved in json format"