import csv

data = [
    ["2024-02-26", "John Doe", 1000, 500],
    ["2024-02-27", "Jane Smith", 2000, 1000]
]

with open("statements.csv", mode="w", newline="") as file:
    writer = csv.writer(file)
    writer.writerow(["date", "name", "amt_in", "amt_out"])  # Header
    writer.writerows(data)  # Write rows

print("CSV file created: statements.csv")
