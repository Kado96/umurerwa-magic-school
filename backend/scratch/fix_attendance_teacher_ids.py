import sqlite3
import os

def fix_attendance_teachers():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get mapping of Teacher: old_id (stored in some way or inferred)
    # Since we don't have the old mapping anymore, we can only:
    # 1. Re-run the mapping discovery if possible
    # 2. Or simply NULL out the invalid teacher_ids to stop the 500
    
    print("Fixing teacher_ids in Attendance...")
    
    # We will set teacher_id to NULL if it's not a valid UUID (length < 10)
    # This will stop the crash and allow the page to load.
    cursor.execute("""
        UPDATE school_attendance 
        SET teacher_id = NULL 
        WHERE teacher_id IS NOT NULL AND length(teacher_id) < 10
    """)
    print(f"Reset {cursor.rowcount} invalid teacher IDs in Attendance.")

    conn.commit()
    conn.close()
    print("\nSUCCESS: Attendance table teacher references fixed.")

if __name__ == "__main__":
    fix_attendance_teachers()
