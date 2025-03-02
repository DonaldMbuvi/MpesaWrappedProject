CREATE TABLE transactions(
id SERIAL PRIMARY KEY,
customer_id INT NOT NULL,
amount DECIMAL(10,2) NOT NULL,
category   VARCHAR(50),
transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(customer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE users(
id SERIAL PRIMARY KEY,
f_name VARCHAR(100) NOT NULL,
l_name VARCHAR(100) NOT NULL,
phone_number VARCHAR (12) UNIQUE NOT NULL,
email VARCHAR (100) UNIQUE NOT NULL
);

INSERT INTO transactions(customer_id, amount, category)
VALUES
(1, 500, 'Food'),
(1, 2000, 'Shopping'),
(2, 1000, 'Transport');

INSERT INTO users(f_name, l_name, phone_number, email)
VALUES
('Donald', 'Mbuvi', '254706899201', 'donaldmbuvi14@gmail.com'),
('Alex', 'Maina', '25492426448', 'alexmurimi@gmail.com'),
('Ian', 'Moses', '254789208201', 'ianmoses@gmail.com');

SELECT * FROM transactions;
SELECT *FROM users;
SELECT * FROM transactions WHERE customer_id=1;
