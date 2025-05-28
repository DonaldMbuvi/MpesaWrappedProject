import psycopg2
from report_generator import report_maker
from database import get_db_connection
import logging
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends,Query, Form
from fastapi.responses import JSONResponse
import csv
from  models import CREATE_INDEX, CREATE_REPORT_TABLE, CREATE_STATEMENT_TABLE
from database import get_db
from _mpesa_app_pdf_to_csv import convert__mpesa_app_pdf_to_csv
from _ussd_pdf_to_csv import convert_ussd_pdf_to_csv
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pypdf import PdfReader

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*" ],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
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
async def upload_csv_and_save_to_db(db: psycopg2.extensions.connection = Depends(get_db), pdf_file: UploadFile = File(...) ,user_id: str = Form(...),  pin: Optional[str] = Form(None)):

    is_encrypted = PdfReader(pdf_file.file).is_encrypted
    if is_encrypted:
        await pdf_file.seek(0)
        cleaned_csv_content = await convert_ussd_pdf_to_csv(pdf_file, pin)
    else:
        await pdf_file.seek(0)
        cleaned_csv_content = convert__mpesa_app_pdf_to_csv(pdf_file)
    if not cleaned_csv_content :
        raise HTTPException(status_code=400, detail="Please provide a valid M-pesa Statement pdf")

    try:
        # Split the CSV content into lines
        csv_data = cleaned_csv_content.splitlines()
        #read csv data
        csv_reader = csv.reader(csv_data)
        next(csv_reader)  # Skip the header row
        cur = db.cursor()

        # For each row in the CSV, insert into the database
        checker = 0
        for row in csv_reader:
            try:
                # Parse the date and time
                transaction_date = row[0]  # '2025-02-27'
                transaction_time = row[1]  # '12:17'
                category = row[2]  # 'Pay Bill'
                paid_to = row[3] if row[3] != 'NULL' else None  # Handle NULL values
                
                # Parse amounts and convert to integers
                amount_in = int(float(row[4].replace(',', ''))) if row[4] and row[4] != '0' else 0
                amount_out = int(float(row[5].replace(',', ''))) if row[5] and row[5] != '0' else 0
                
                user_name = row[6]  

                
                if checker == 0:
                    # 1. Check if the user_name exists only at first iteration
                    cur.execute("""
                        SELECT 1 FROM statement_table 
                        WHERE user_name = %s
                        LIMIT 1;
                    """, (user_name,))
                    user_exists = cur.fetchone() is not None

                    # 2. delete the username
                    if user_exists:
                        # Update existing record
                        delete_sql = """
                            DELETE FROM statement_table
                                WHERE user_name = %s;
                        """
                        cur.execute(delete_sql, (user_name,))
                    checker += 1
                # Insert new record
                insert_sql = """
                    INSERT INTO statement_table 
                    (user_id, user_name, transaction_date, transaction_time, 
                    category, paid_to, amount_in, amount_out)
                    VALUES ( %s, %s, %s, %s, %s, %s, %s, %s);
                """
                cur.execute(insert_sql, (user_id, user_name, transaction_date, transaction_time, category, paid_to, amount_in, amount_out))
            except (ValueError, IndexError) as e:
                raise HTTPException(status_code=400, detail=f"Error processing row {row}: {e}")

        db.commit()
        cur.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing CSV: {str(e)}")
    report_response = await (report_maker(db, user_id, user_name))   
    print(report_response)
    return "message: Transactions uploaded and saved to the database successfully"


@app.get("/report")
async def get_report(user_id: str = Query(...), db = Depends(get_db_connection)):
    """
    Retrieve the most recent report for a user
    """
    try:
        cur = db.cursor()
        # Fetch the most recent report for this user
        cur.execute("""
            SELECT report_data 
            FROM report_table 
            WHERE user_id = %s
            ORDER BY created_at DESC
            LIMIT 1
        """, (user_id,))
        
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