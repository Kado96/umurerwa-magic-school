import os
import django
import sys
import uuid

# Setup django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Subject, Class, Student, SchoolYear, Term, Teacher, Parent
from api.accounts.models import Profile

def check_model(model, name_field='name'):
    print(f"\n--- Checking {model.__name__} ---")
    try:
        items = model.objects.all()
        if not items.exists():
            print("No data found.")
            return
        
        for item in items[:10]:
            val = getattr(item, name_field, "N/A")
            pk = item.pk
            print(f"ID: {pk} | {name_field}: {val}")
            
            # Check if ID looks like a name or name looks like a UUID
            if isinstance(pk, str) and not "-" in str(pk) and len(str(pk)) > 20:
                print(f"  [!] WARNING: ID might be a name? {pk}")
            try:
                uuid.UUID(str(val))
                print(f"  [!] WARNING: {name_field} looks like a UUID? {val}")
            except:
                pass
    except Exception as e:
        print(f"Error checking {model.__name__}: {e}")

def run_diagnostic():
    check_model(SchoolYear)
    check_model(Term)
    check_model(Subject)
    check_model(Class)
    check_model(Student, 'last_name')
    check_model(Teacher, 'id') # Teacher uses UUID as PK
    check_model(Profile, 'role')

if __name__ == "__main__":
    print("DATABASE DIAGNOSTIC START")
    run_diagnostic()
    print("\nDIAGNOSTIC END")
    print("If you see inverted values, please let me know. I can provide a fix script.")
