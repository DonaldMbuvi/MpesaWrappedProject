from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

url_db = 'postgress://root:passw@localhost:5432/statements_db'
engine = create_engine(url_db)
sessionLocal = sessionmaker(bind=engine)
Base = declarative_base()