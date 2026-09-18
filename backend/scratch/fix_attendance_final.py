import sqlite3
import os

def fix_attendance():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Cleaning orphans in Attendance...")
    # Delete entries pointing to students or teachers that no longer exist
    cursor.execute("""
        DELETE FROM school_attendance 
        WHERE student_id NOT IN (SELECT id FROM school_student)
    """)
    print(f"Removed orphaned records: {cursor.rowcount}")

    conn.commit()
    conn.close()
    print("\nSUCCESS: Attendance table cleaned.")

if __name__ == "__main__":
    fix_attendance()
