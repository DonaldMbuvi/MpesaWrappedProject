## database.py
from typing import Generator
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection settings
db_name = "wrapped_db"
db_user = "postgres"
db_password = "safcoM"
db_host = "localhost"
db_port = "5432"

# Function to get a database connection
def get_db_connection():
    conn = psycopg2.connect(
        dbname=db_name,
        user=db_user,
        password=db_password,
        host=db_host,
        port=db_port,
        cursor_factory=RealDictCursor
    )
    return conn

# Dependency for database connection
def get_db() -> Generator:
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()
