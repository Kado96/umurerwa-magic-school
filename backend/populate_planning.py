import os
import django
import random
from datetime import time

import sys
from pathlib import Path

# Setup Django environment
BASE_DIR = Path(__file__).resolve().parent
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'umurerwa.settings')
sys.path.insert(0, str(BASE_DIR))
sys.path.insert(0, str(BASE_DIR / 'api'))
django.setup()

from api.school.models import Class, Subject, Teacher, Announcement, TimetableEntry
from django.contrib.auth.models import User

def populate_planning():
    print("Génération des annonces et de l'emploi du temps...")

    classes = Class.objects.all()
    subjects = Subject.objects.all()
    teachers = Teacher.objects.all()
    admin_user = User.objects.filter(is_staff=True).first()

    if not classes.exists() or not subjects.exists() or not teachers.exists():
        print("Erreur: Données de base manquantes.")
        return

    # 1. Annonces
    print("- Création des annonces...")
    announcements = [
        ("Réunion de rentrée", "Tous les parents sont invités à la réunion de rentrée ce samedi à 10h.", "PARENT", "MEETING"),
        ("Nouveaux uniformes", "Les nouveaux uniformes sont disponibles à la boutique de l'école.", "ALL", "GENERAL"),
        ("Conseil de classe", "Le conseil de classe pour les 7èmes aura lieu lundi prochain.", "TEACHER", "MEETING"),
        ("Examen de Mathématiques", "Préparez-vous pour l'examen de fin de trimestre.", "ALL", "EXAM"),
    ]
    
    for title, content, role, cat in announcements:
        Announcement.objects.get_or_create(
            title=title,
            defaults={
                'content': content,
                'target_role': role,
                'category': cat,
                'author': admin_user
            }
        )

    # 2. Emploi du temps (Timetable)
    print("- Création de l'emploi du temps pour 3 classes...")
    slots = [
        (time(8, 0), time(10, 0)),
        (time(10, 15), time(12, 15)),
        (time(13, 30), time(15, 30))
    ]
    
    for c in classes[:3]: # On prend les 3 premières classes
        for day in range(5): # Du Lundi (0) au Vendredi (4)
            for i, (start, end) in enumerate(slots):
                subject = random.choice(list(subjects))
                teacher = teachers.filter(subjects=subject).first() or random.choice(teachers)
                
                TimetableEntry.objects.get_or_create(
                    class_obj=c,
                    day=day,
                    start_time=start,
                    end_time=end,
                    defaults={
                        'subject': subject,
                        'teacher': teacher,
                        'classroom': f"Salle {random.randint(1, 20)}"
                    }
                )

    print("Population terminée !")

if __name__ == "__main__":
    populate_planning()
