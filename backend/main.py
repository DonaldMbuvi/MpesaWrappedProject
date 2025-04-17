import json
import psycopg2
import asyncio
from report_generator import report_maker
from database import get_db_connection
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
from fastapi.responses import JSONResponse
import csv
from  models import CREATE_INDEX, CREATE_REPORT_TABLE, CREATE_STATEMENT_TABLE
from database import get_db
from pdf_to_csv import convert_pdf_to_csv
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5174", "http://localhost:5173" ],
    allow_methods="GET"
)
# Create database table upon start up if they don't exist
@app.on_event("startup")
def create_tables():
    db = get_db_connection()
    cur = db.cursor()
    cur.execute(CREATE_STATEMENT_TABLE)
    cur.execute(CREATE_REPORT_TABLE)
    cur.execute(CREATE_INDEX)
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
    rep = asyncio.run(report_maker(db, user_name))   
    print(rep)
    return "message: Transactions uploaded and saved in Json format successfully"


@app.get("/report")
async def get_report(user_name: str, db = Depends(get_db_connection)):
    """
    Retrieve the most recent report for a user
    """
    try:
        cur = db.cursor()
        
        # Fetch the most recent report for this user
        cur.execute("""
            SELECT report_data 
            FROM report_table 
            WHERE user_name = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (user_name,))
        
        report = cur.fetchone()
        cur.close()
        
        if not report:
            raise HTTPException(status_code=404, detail="No report found for this user")
        
        # Return the report exactly as stored in the database
        return JSONResponse(content=report['report_data'])
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")