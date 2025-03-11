CREATE_STATEMENT_TABLE = """
CREATE TABLE IF NOT EXISTS statement_table (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    mobile_number VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_time TIME NOT NULL,
    category VARCHAR(50) NOT NULL,
    paid_to VARCHAR(50) NULL,
    amount_in INTEGER,
    amount_out INTEGER
);
"""