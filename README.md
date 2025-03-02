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



RESOURCES: (optional)
FastAPI & Postgres: https://youtu.be/398DuQbQJq0?si=uUl4iBfbPCQyZIqd
CSV to Database: https://youtu.be/fRSIJBhIhLA?si=72cPXSgljRAfMGTv