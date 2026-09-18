from api.school.models import Subject, Class, Student
import sys

def check():
    print("--- SUBJECTS ---")
    for s in Subject.objects.all():
        print(f"ID: {s.id} | Name: {s.name} | Code: {s.code}")
    
    print("\n--- CLASSES ---")
    for c in Class.objects.all():
        print(f"ID: {c.id} | Name: {c.name}")

    print("\n--- STUDENTS ---")
    for st in Student.objects.all()[:10]: # Limit to 10
        print(f"ID: {st.id} | Name: {st.first_name} {st.last_name}")

if __name__ == "__main__":
    import os
    import django
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
    django.setup()
    check()
