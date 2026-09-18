import os
import django
import sys

# Setup django
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Subject, Class, Student

print("--- SUBJECTS ---")
for s in Subject.objects.all()[:5]:
    print(f"ID: {s.id} | Name: {s.name} | Code: {s.code}")

print("\n--- CLASSES ---")
for c in Class.objects.all()[:5]:
    print(f"ID: {c.id} | Name: {c.name}")

print("\n--- STUDENTS ---")
for st in Student.objects.all()[:5]:
    print(f"ID: {st.id} | Name: {st.first_name} {st.last_name} | Class_ID: {st.student_class_id}")
