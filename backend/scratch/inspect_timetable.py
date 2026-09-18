import sqlite3
import os

def inspect_timetable():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    table = 'school_timetableentry'
    print(f"\n--- Table: {table} ---")
    try:
        cursor.execute(f"SELECT * FROM {table}")
        cols = [description[0] for description in cursor.description]
        print(f"Columns: {cols}")
        rows = cursor.fetchall()
        for row in rows:
            print(row)
            # Check for non-uuid in ID or FKs
            for i, val in enumerate(row):
                if cols[i] in ['id', 'class_obj_id', 'subject_id', 'teacher_id']:
                    if val and len(str(val)) < 10:
                        print(f"  [!] CRITICAL: Column {cols[i]} contains old ID: {val}")
    except Exception as e:
        print(f"Error: {e}")
    conn.close()

if __name__ == "__main__":
    inspect_timetable()
