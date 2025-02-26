#!/bin/bash
python3 -m venv venv
source venv/bin/activate
pip install fastapi sqlalchemy psycopg2-binary uvicorn python-multipart
