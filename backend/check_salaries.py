import os
import django
import sys

# Setup Django
sys.path.append(r'e:\Application\UMURERWA\umurerwa-magic-school\backend\api')
sys.path.append(r'e:\Application\UMURERWA\umurerwa-magic-school\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from school.models import Salary

try:
    salaries = Salary.objects.all()
    print(f"Total salaries: {salaries.count()}")
    if salaries.exists():
        s = salaries.first()
        print(f"Fields in first salary: {s.__dict__.keys()}")
        print(f"Month: {s.month}, Base Salary: {s.base_salary}")
except Exception as e:
    print(f"Error: {e}")
