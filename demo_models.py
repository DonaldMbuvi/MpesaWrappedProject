from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date
from demo_database import Base

class Statement(Base):
	__tablename__ = "statement_table"
	id = Column(Integer, primary_key=True, autoincrement=True)
	username = Column(String(100), nullable=False)
	date = Column(Date, nullable=False)
	name = Column(String(100), nullable=False)
	amt_in = Column(Integer, nullable=True)
	amt_out = Column(Integer, nullable=True)