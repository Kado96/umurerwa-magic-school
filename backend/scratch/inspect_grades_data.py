import sqlite3
import os

def inspect_grades():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    table = 'school_grade'
    print(f"\n--- Table: {table} ---")
    try:
        cursor.execute(f"SELECT * FROM {table} LIMIT 10")
        cols = [description[0] for description in cursor.description]
        print(f"Columns: {cols}")
        rows = cursor.fetchall()
        for row in rows:
            print(row)
            for i, val in enumerate(row):
                # Check for ID format issues
                if cols[i] in ['id', 'student_id', 'subject_id', 'teacher_id', 'term_id']:
                    if val and len(str(val)) < 10:
                        print(f"  [!] ALERT: Column {cols[i]} has old ID: {val}")
    except Exception as e:
        print(f"Error: {e}")
    conn.close()

if __name__ == "__main__":
    inspect_grades()
