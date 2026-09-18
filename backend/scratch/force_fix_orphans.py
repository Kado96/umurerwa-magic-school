import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Student, Class

def force_fix():
    print("Scanning students for broken class references...")
    students = Student.objects.all()
    fixed_count = 0
    for s in students:
        if s.student_class_id:
            try:
                # This triggers the fetch and will fail if orphan
                _ = s.student_class
            except Class.DoesNotExist:
                print(f"  ! Fixing orphan student: {s.first_name} {s.last_name} (Class ID: {s.student_class_id} was invalid)")
                s.student_class_id = None
                s.save()
                fixed_count += 1
    
    print(f"\nFinished. Fixed {fixed_count} students.")

if __name__ == "__main__":
    force_fix()
