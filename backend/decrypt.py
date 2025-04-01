import os
from PyPDF2  import PdfReader, PdfWriter
import requests
def decrypter(pdf_file, password=379549):
    # """Decrypt PDF and convert it to CSV"""
    writer = PdfWriter()
    reader = PdfReader(pdf_file)
    if reader.is_encrypted:
        try:
            print("demo.py - decrypting PDF")
            result = reader.decrypt(str(password))
            if result==0:
                raise ValueError("Wrong password")
            print("demo.py - PDF encrypted")
        except Exception as e:
            raise Exception(f"Error decrypting: {e}")
    else:
        print("demo.py - File is not encrypted.")
        return pdf_file
    for page in reader.pages:
        writer.add_page(page)
    # Ensure the directory exists
    SAVE_DIR = "decrypted_pdfs"
    os.makedirs(SAVE_DIR, exist_ok=True)
    decrypted_file_location = os.path.join(SAVE_DIR, pdf_file)

    with open(decrypted_file_location, "wb"):
        writer.write(decrypted_file_location)
    print("demo.py - decrypter returning the decrypted_file_location: ", decrypted_file_location)
    return decrypted_file_location
    


