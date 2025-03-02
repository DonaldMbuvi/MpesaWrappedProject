import inspect
import json
from typing import Annotated
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Query
import csv
from pydantic import BaseModel
from  demo_models import Statement
from demo_database import engine, sessionLocal
from sqlalchemy.orm import Session
from demo_database import Base

# Initialize FastAPI app
app = FastAPI()

# Create database table if they don't exist
Statement.__table__.create(bind=engine, checkfirst=True)


# Define Pydantic model for request validation
class StatementBase(BaseModel):
	date: str
	name: str
	amt_in: int
	amt_out: int

# Dependency to get a database session
def get_db():
	db = sessionLocal()
	try:
		yield db
	finally:
		db.close()

# Annotated dependency for type hinting in FastAPI
db_dependency = Annotated[Session, Depends(get_db)]

# API endpoint to save a statement to the database
@app.post("/upload-csv/")
def upload_csv_and_save_to_db(db: db_dependency, username: str = Query(...), file: UploadFile = File(...)):
	#check if file is csv
	if not file.filename.endswith('.csv'):
		raise HTTPException(status_code=400, detail="File is not a csv file")
	#read csv data
	contents =  file.file.read()

	#parse the contents
	csv_data = contents.decode('utf-8').splitlines()
	csv_reader = csv.reader(csv_data)
	next(csv_reader)  # Skip the header row

	#store csv data in mysql
	for row in csv_reader:
		item = Statement(username = username, date=row[0], name=row[1], amt_in=int(row[2]), amt_out=int(row[3]))
		db.add(item)
	db.commit()
	db.close()

# API endpoint for getting the saved transactions
@app.get('/get_transactions/')
def get_transactions(db: db_dependency,  username: str = Query(...)):
    user_statement = db.query(Statement).filter(Statement.username == username).all()
	# Convert to dictionary format
    user_statement_dict = [
		{
			"id": row.id,
			"name": row.name,
			"amt_out": row.amt_out,
			"amt_in": row.amt_in,
			"date": str(row.date) 
		}
		for row in user_statement
	]
	#save the statement in json file
    with open("user_statement.json", "w") as file:
        json.dump(user_statement_dict, file, indent=4)
    return "transaction saved in json format"
