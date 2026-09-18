import sqlite3
import uuid
import os

def fix_database():
    db_path = 'db.sqlite3'
    if not os.path.exists(db_path):
        print("Database not found.")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Step 0: Cleaning up garbage data...")
    cursor.execute("DELETE FROM school_schoolyear WHERE name LIKE 'EMAIL_%' OR name LIKE 'DB_%'")
    cursor.execute("DELETE FROM school_subject WHERE name = 'hhhhh'")
    
    # Mapping of {table_name: {old_id: new_uuid}}
    mapping = {}

    tables_to_fix = [
        'school_schoolyear', 'school_term', 'school_class', 
        'school_subject', 'school_teacher', 'school_student', 
        'school_parent', 'school_announcement', 'school_sitesettings'
    ]

    print("Step 1: Generating new UUIDs for all records...")
    for table in tables_to_fix:
        mapping[table] = {}
        try:
            cursor.execute(f"SELECT id FROM {table}")
            rows = cursor.fetchall()
            for (old_id,) in rows:
                if len(str(old_id)) < 10: # It's an old short ID
                    mapping[table][str(old_id)] = str(uuid.uuid4())
        except Exception as e:
            print(f"Skipping {table}: {e}")

    print("Step 2: Updating IDs and Foreign Keys...")
    
    # Disable foreign key constraints temporarily to allow updates
    cursor.execute("PRAGMA foreign_keys = OFF")

    # Update primary keys
    for table, ids in mapping.items():
        for old_id, new_id in ids.items():
            cursor.execute(f"UPDATE {table} SET id = ? WHERE id = ?", (new_id, old_id))
            print(f"Updated {table}: {old_id} -> {new_id}")

    # Update Foreign Keys
    fk_updates = [
        ('school_term', 'school_year_id', 'school_schoolyear'),
        ('school_class', 'school_year_id', 'school_schoolyear'),
        ('school_student', 'student_class_id', 'school_class'),
        ('school_grade', 'student_id', 'school_student'),
        ('school_grade', 'subject_id', 'school_subject'),
        ('school_grade', 'term_id', 'school_term'),
        ('school_grade', 'teacher_id', 'school_teacher'),
        ('school_attendance', 'student_id', 'school_student'),
        ('school_timetableentry', 'class_obj_id', 'school_class'),
        ('school_timetableentry', 'subject_id', 'school_subject'),
        ('school_timetableentry', 'teacher_id', 'school_teacher'),
        ('school_announcement', 'target_class_id', 'school_class'),
        ('school_enrollment', 'target_class_id', 'school_class'),
        ('school_payment', 'student_id', 'school_student'),
        ('school_salary', 'teacher_id', 'school_teacher'),
        ('school_teacherattendance', 'teacher_id', 'school_teacher'),
    ]

    for table, fk_col, ref_table in fk_updates:
        if ref_table in mapping:
            for old_id, new_id in mapping[ref_table].items():
                cursor.execute(f"UPDATE {table} SET {fk_col} = ? WHERE {fk_col} = ?", (new_id, old_id))

    # Many-to-Many tables
    m2m_updates = [
        ('school_teacher_subjects', 'teacher_id', 'school_teacher'),
        ('school_teacher_subjects', 'subject_id', 'school_subject'),
        ('school_teacher_classes', 'teacher_id', 'school_teacher'),
        ('school_teacher_classes', 'class_id', 'school_class'),
        ('school_parent_students', 'parent_id', 'school_parent'),
        ('school_parent_students', 'student_id', 'school_student'),
    ]

    for table, col, ref_table in m2m_updates:
        if ref_table in mapping:
            for old_id, new_id in mapping[ref_table].items():
                try:
                    cursor.execute(f"UPDATE {table} SET {col} = ? WHERE {col} = ?", (new_id, old_id))
                except: pass

    conn.commit()
    cursor.execute("PRAGMA foreign_keys = ON")
    conn.close()
    print("\nSUCCESS: Database IDs converted to UUIDs and relationships restored.")

if __name__ == "__main__":
    fix_database()
