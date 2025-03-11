USAGE:
in the linux terminal run:  make && source venv/bin/activate
or in	windows cmd run: make && venv\Scripts\activate
or in 	windows	powershell run: make; .\venv\Scripts\Activate

first run the commands
(if using liux)
python3 -m venv venv
source venv/bin/activate
pip install fastapi sqlalchemy psycopg2-binary uvicorn python-multipart


(if using windows, cmd)
python -m venv venv
venv\Scripts\activate
pip install fastapi sqlalchemy psycopg2-binary uvicorn python-multipart



run the backend
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

convert pdf to csv, then save to the database and then retrieve it and save as json file
curl -X POST "http://127.0.0.1:8000/upload-pdf/" -F "pdf_file=@MpesaStatement.pdf"


see the transactions in the postgres db (in linux terminal)
sudo -u postgres psql
in windows - psql -U postgres

RESOURCES: (optional)
FastAPI & Postgres: https://youtu.be/398DuQbQJq0?si=uUl4iBfbPCQyZIqd
CSV to Database: https://youtu.be/fRSIJBhIhLA?si=72cPXSgljRAfMGTv
