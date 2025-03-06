CREATE_STATEMENT_TABLE = """
CREATE TABLE IF NOT EXISTS statement_table (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    date DATE NOT NULL,
    name VARCHAR(100) NOT NULL,
    amt_in INTEGER,
    amt_out INTEGER
);
"""