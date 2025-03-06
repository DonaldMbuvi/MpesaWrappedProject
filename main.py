from io import StringIO
import json
import os
import psycopg2
from database import get_db_connection
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Query
import csv
from  models import CREATE_STATEMENT_TABLE
from database import get_db
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
@app.post("/upload-csv/")
def upload_csv_and_save_to_db(db: psycopg2.extensions.connection = Depends(get_db), username: str = Query(...), pdf_file: UploadFile = File(...)):

    cleaned_csv_content  = convert_pdf_to_csv(pdf_file)
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
        for row in csv_reader:
            sql = """
            INSERT INTO statement_table (username, date, name, amt_in, amt_out)
            VALUES (%s, %s, %s, %s, %s);
            """	
            try:
                amt_in = int(float(row[2].replace(',', ''))) if row[2] else 0
                amt_out = 0  # You might need to adjust this based on your data structure
                cur.execute(sql, (username, row[0], row[1][:10], amt_in, amt_out))
            except (ValueError, IndexError) as e:
                print(f"Error processing row {row}: {e}")
                continue
        db.commit()
        cur.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSVv: {str(e)}")
    return "message: Transactions uploaded successfully"


# API endpoint for getting the saved transactions
@app.get('/get_transactions/')
def get_transactions(db: psycopg2.extensions.connection = Depends(get_db),  username: str = Query(...)):
    cur = db.cursor()
    sql = """SELECT id, name, amt_out, amt_in, date FROM statement_table WHERE username = %s ORDER BY date DESC;"""
    cur.execute(sql, (username,))
    transactions = cur.fetchall()
    cur.close()

    
    if not transactions:
        raise HTTPException(status_code=404, detail="No transactions found for this user") 

    #save the statement in json file
    with open("user_statement.json", "w") as file:
        json.dump(transactions, file, indent=4, default=str)
    return "transaction saved in json format"