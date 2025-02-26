from typing import Annotated
from fastapi import FastAPI, HTTPException, UploadFile, File, Depends
import csv
from pydantic import BaseModel
import MpesaWrappedProject.demo_models as demo_models
from MpesaWrappedProject.demo_database import engine, sessionLocal
from sqlalchemy.orm import Session

# Initialize FastAPI app
app = FastAPI()

# Create database table if they don't exist
demo_models.Statement.__table__.create(bind=engine, checkfirst=True)

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
def upload_csv_and_save_to_db(db: db_dependency, file: UploadFile = File(...)):
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
		item = demo_models.Statement(date=row[0], name=row[1], amt_in=int(row[2]), amt_out=int(row[3]))
		db.add(item)
	db.commit()
	db.close()
