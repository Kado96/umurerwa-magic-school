import os
import django
import sys
from django.db import connection

# Setup Django
sys.path.append(r'e:\Application\UMURERWA\umurerwa-magic-school\backend\api')
sys.path.append(r'e:\Application\UMURERWA\umurerwa-magic-school\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

with connection.cursor() as cursor:
    cursor.execute('PRAGMA table_info(school_salary)')
    columns = cursor.fetchall()
    print("Columns in school_salary:")
    for col in columns:
        print(f"ID: {col[0]}, Name: {col[1]}, Type: {col[2]}, NotNull: {col[3]}, Default: {col[4]}, PK: {col[5]}")

    cursor.execute('SELECT * FROM school_salary LIMIT 1')
    row = cursor.fetchone()
    if row:
        print("\nFirst row data:")
        print(row)
    else:
        print("\nNo rows in school_salary")
