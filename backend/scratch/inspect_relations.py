import os
import django
import sys

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Class, Student, Teacher

def inspect():
    print("=== CLASSES INSPECTION ===")
    classes = Class.objects.all()
    for c in classes:
        student_count = c.students.count()
        teacher_count = c.teachers.count()
        print(f"ID: {c.id} | Name: {c.name} | Students: {student_count} | Teachers: {teacher_count}")
        if teacher_count > 0:
            teachers = ", ".join([str(t) for t in c.teachers.all()])
            print(f"   Teachers: {teachers}")

    print("\n=== STUDENTS INSPECTION (Sample) ===")
    for s in Student.objects.all()[:5]:
        print(f"Student: {s.first_name} {s.last_name} | Class: {s.student_class.name} (ID: {s.student_class.id})")

if __name__ == "__main__":
    inspect()
