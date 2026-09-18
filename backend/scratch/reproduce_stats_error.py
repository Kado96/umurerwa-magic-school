import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
django.setup()

from api.school.models import Student, Grade
from django.db.models import Avg, Q

def reproduce():
    print("Testing academic_stats query...")
    try:
        stats = Student.objects.annotate(
            avg_grade=Avg('grades__value', filter=Q(grades__max_value=20))
        ).order_by('-avg_grade')[:5]
        
        for s in stats:
            print(f"Student: {s.first_name} {s.last_name}, Avg: {s.avg_grade}, Class: {s.student_class}")
            
        print("\nQuery successful!")
    except Exception as e:
        print(f"\n[!] ERROR DETECTED: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    reproduce()
