# Mpesa Wrapped

Mpesa Wrapped is a web application that allows users to upload M-Pesa statements in PDF format and ultimately get their transaction analysis i.e:

1. 3 Highest Transactions Made
2. &#x20;Top 5 Days with Most Transactions
3. &#x20;Annual Amount Spent on Lipa na M-Pesa: Breakdown of spending on paybills, tills, and Pochi la Biashara.
4. Most Frequent Transactions: Show the most recurring transactions (e.g., subscriptions, bills). 
5. Top 3 Months by Total Transactions:&#x20;
6. Amount Spent on Airtime and Bundles
By displaying the Mpesa Wrapped results in a card format, inspired by Spotify Wrapped, with an auto-slideshow effect for seamless viewing.
Since it converts the pdf to csv, extract and clean the transaction data from the csv and store it in a PostgreSQL database. The extracted data is also saved in JSON format for analysis using Pandas library.

## Features

- Upload M-Pesa statement PDFs
- Convert PDFs to CSV format
- Clean and store transactions in a PostgreSQL database
- Retrieve and save transaction data in JSON format for analysis
- Frontend built with React
- Backend powered by FastAPI

## Technologies Used

### Frontend:

- React
- Axios for API requests
- CSS for styling

### Backend:

- FastAPI
- PostgreSQL
- Psycopg2 for database interactions
- pypdf for PDF processing
- pandas for converting pdf to csv, cleaning the data and analysing the cleaned transactions
- CORS middleware for frontend-backend communication

## Installation and Setup

### Prerequisites

Ensure you have the following installed:

- Python 3.x
- PostgreSQL
- Node.js & npm

### Backend Setup

1. Clone the repository:
   ```sh
   git clone [https://github.com/DonaldMbuvi/MpesaWrappedProject.git]
   cd mpesa_wrapped/backend
   ```
2. Create a virtual environment and activate it:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Set up the PostgreSQL database:
   ```sh
   sudo -u postgres psql
   createdb mpesa_wrapped
   ```
5. Run the FastAPI server:
   ```sh
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the React application:
   ```sh
   npm start
   ```

## API Endpoints

- `POST /upload-pdf/` - Uploads a PDF, extracts, cleans transactions, and saves them to the database.

## Troubleshooting

- If file uploads fail with "unknown error," ensure the backend is running and accessible at `http://localhost:8000`.

## Contributors

- Newton Kiprono
- Ian Kiprono Moses
- Alex Maina
- Donald Mbuvi

