import sqlite3
import os

def inspect_accounts():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    tables = ['accounts_profile', 'accounts_notification']
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
            print(f"Error: {e}")
    conn.close()

if __name__ == "__main__":
    inspect_accounts()
