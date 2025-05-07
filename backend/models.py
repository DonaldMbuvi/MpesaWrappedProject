CREATE_STATEMENT_TABLE = """
CREATE TABLE IF NOT EXISTS statement_table (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    start_date VARCHAR(40) NULL,
    transaction_date DATE NOT NULL,
    transaction_time TIME NOT NULL,
    category VARCHAR(50) NOT NULL,
    paid_to VARCHAR(200) NULL,
    amount_in INTEGER,
    amount_out INTEGER
);
"""
CREATE_REPORT_TABLE = """
CREATE TABLE  IF NOT EXISTS  report_table (
    report_id SERIAL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    report_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);"""

CREATE_INDEX = """
CREATE INDEX  IF NOT EXISTS  idx_report_user_name ON report_table(user_name);
"""