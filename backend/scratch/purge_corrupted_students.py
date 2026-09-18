import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Student, Class

def purge_corrupted():
    print("Purging students with non-existent class references...")
    students = Student.objects.all()
    deleted_count = 0
    for s in students:
        if s.student_class_id:
            try:
                # Check if class exists
                _ = s.student_class
            except Class.DoesNotExist:
                print(f"  ! Deleting corrupted student: {s.first_name} {s.last_name} (Invalid Class ID: {s.student_class_id})")
                s.delete()
                deleted_count += 1
    
    print(f"\nFinished. Deleted {deleted_count} corrupted students.")

if __name__ == "__main__":
    purge_corrupted()
