import sqlite3
import uuid
import os

def fix_accounts():
    db_path = 'db.sqlite3'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    tables = ['accounts_profile', 'accounts_notification']
    
    cursor.execute("PRAGMA foreign_keys = OFF")
    
    for table in tables:
        print(f"Fixing {table}...")
        try:
            cursor.execute(f"SELECT id FROM {table}")
            rows = cursor.fetchall()
            for (old_id,) in rows:
                if len(str(old_id)) < 10:
                    new_id = str(uuid.uuid4())
                    cursor.execute(f"UPDATE {table} SET id = ? WHERE id = ?", (new_id, old_id))
                    print(f"  Updated: {old_id} -> {new_id}")
        except Exception as e:
            print(f"  Error on {table}: {e}")

    conn.commit()
    cursor.execute("PRAGMA foreign_keys = ON")
    conn.close()
    print("\nSUCCESS: Accounts IDs converted to UUIDs.")

if __name__ == "__main__":
    fix_accounts()
