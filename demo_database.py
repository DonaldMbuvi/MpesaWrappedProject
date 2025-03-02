from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base


url_db = 'postgresql://postgres:safcoM@localhost:5432/wrapped_db'
engine = create_engine(url_db)
sessionLocal = sessionmaker(bind=engine)
Base = declarative_base()