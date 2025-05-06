import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Generator

# Local database settings (fallback)
LOCAL_DB_CONFIG = {
    "dbname": "wrapped_db",
    "user": "postgres",
    "password": "postgres",
    "host": "localhost",
    "port": "5432",
    "cursor_factory": RealDictCursor
}

def get_db_connection():
    db_url = os.environ.get("DATABASE_URL")
    
    if db_url:
        # Use DATABASE_URL for Render on production
        return psycopg2.connect(db_url, cursor_factory=RealDictCursor)
    else:
        # Fallback to local dev config
        return psycopg2.connect(**LOCAL_DB_CONFIG)

def get_db() -> Generator:
    conn = get_db_connection()
    try:
        yield conn
    finally:
        conn.close()
