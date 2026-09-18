import sqlite3
import uuid
import os

def fix_timetable():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Step 1: Converting Timetable IDs to UUIDs...")
    cursor.execute("SELECT id FROM school_timetableentry")
    rows = cursor.fetchall()
    for (old_id,) in rows:
        if len(str(old_id)) < 10:
            new_id = str(uuid.uuid4())
            cursor.execute("UPDATE school_timetableentry SET id = ? WHERE id = ?", (new_id, old_id))

    print("Step 2: Cleaning up orphaned subjects in Timetable...")
    # Delete entries pointing to subjects that no longer exist
    cursor.execute("""
        DELETE FROM school_timetableentry 
        WHERE subject_id NOT IN (SELECT id FROM school_subject)
        OR teacher_id NOT IN (SELECT id FROM school_teacher)
        OR class_obj_id NOT IN (SELECT id FROM school_class)
    """)
    
    print(f"Removed orphaned records: {cursor.rowcount}")

    conn.commit()
    conn.close()
    print("\nSUCCESS: Timetable table is now clean and UUID-compliant.")

if __name__ == "__main__":
    fix_timetable()
