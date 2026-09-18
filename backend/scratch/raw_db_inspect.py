import sqlite3
import os

def inspect_raw():
    db_path = 'db.sqlite3'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    tables = ['school_subject', 'school_class', 'school_student', 'school_schoolyear']
    
    for table in tables:
        print(f"\n--- Table: {table} ---")
        try:
            cursor.execute(f"SELECT * FROM {table} LIMIT 5")
            cols = [description[0] for description in cursor.description]
            print(f"Columns: {cols}")
            rows = cursor.fetchall()
            for row in rows:
                print(row)
        except Exception as e:
            print(f"Error reading {table}: {e}")
    
    conn.close()

if __name__ == "__main__":
    inspect_raw()
