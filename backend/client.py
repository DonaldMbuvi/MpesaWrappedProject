import requests
url = "http://127.0.0.1:8000/decrypt_pdf/"
file_path = "MPESA_Statement_2024-03-09_to_2025-03-09_2547xxxxxx580 - Copy.pdf"
# file_path = "MpesaStatement.pdf"
with open(file_path, "rb") as file:
	files = {"pdf_file": file}
	response = requests.post(url, files=files)

print(response.text)