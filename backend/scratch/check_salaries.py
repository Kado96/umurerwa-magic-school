import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Salary, Teacher

def check_salaries():
    print("=== SALARY VS TEACHER CHECK ===")
    salaries = Salary.objects.all()
    if not salaries.exists():
        print("No salary records found.")
        return

    for s in salaries:
        teacher_name = str(s.teacher)
        print(f"Salary ID: {s.id} | Month: {s.month} | Amount: {s.base_salary} | Assigned Teacher: {teacher_name} (ID: {s.teacher.id})")
        if s.deductions > 0 or s.bonus > 0:
            print(f"   Details: Bonus={s.bonus}, Ded={s.deductions}")

if __name__ == "__main__":
    check_salaries()
