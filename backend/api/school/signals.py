from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Grade, TimetableEntry, Attendance, Student, Announcement
from api.accounts.models import Notification
from django.contrib.auth.models import User

def create_notif(user, title, message, n_type):
    Notification.objects.create(
        user=user,
        title=title,
        message=message,
        notification_type=n_type
    )

@receiver(post_save, sender=Announcement)
def notify_announcement(sender, instance, created, **kwargs):
    if created:
        msg = instance.content[:100] + "..." if len(instance.content) > 100 else instance.content
        cat_map = {
            'HOMEWORK': 'HOMEWORK',
            'EXAM': 'HOMEWORK',
            'MEETING': 'MEETING',
            'EVENT': 'GENERAL',
            'GENERAL': 'GENERAL'
        }
        n_type = cat_map.get(instance.category, 'GENERAL')
        
        if instance.target_class:
            # Notifier parents et élèves de la classe
            students = instance.target_class.students.all()
            for s in students:
                # Aux parents
                for p in s.parents.all():
                    create_notif(p.user, instance.title, msg, n_type)
                # Aux élèves (si on a des comptes élèves, sinon au moins aux parents)
            
            # Aux profs de la classe
            for t in instance.target_class.teachers.all():
                create_notif(t.user, instance.title, msg, n_type)
        else:
            # Ecole entière (Attention: peut être lourd si beaucoup d'utilisateurs)
            # Pour l'instant on se limite aux Admins, Professeurs et Parents
            users = User.objects.filter(profile__role__in=['ADMIN', 'TEACHER', 'PARENT'])
            for u in users:
                create_notif(u, instance.title, msg, n_type)

@receiver(post_save, sender=Grade)
def notify_grade_added(sender, instance, created, **kwargs):
    if created:
        # Notifier les parents de l'élève
        parents = instance.student.parents.all()
        for p in parents:
            create_notif(
                p.user, 
                "Nouvelle Note Disponible", 
                f"Une nouvelle note a été ajoutée pour {instance.student.first_name} en {instance.subject.name} : {instance.value}/{instance.max_value}.",
                'GRADE'
            )

@receiver(post_save, sender=TimetableEntry)
def notify_timetable_change(sender, instance, created, **kwargs):
    # Notifier les professeurs de la classe
    teachers = instance.class_obj.teachers.all()
    msg = f"L'emploi du temps de la classe {instance.class_obj.name} a été mis à jour ({instance.get_day_display()} - {instance.subject.name})."
    
    for t in teachers:
        create_notif(t.user, "Changement Emploi du Temps", msg, 'TIMETABLE')
    
    # Notifier les parents des élèves de la classe
    students = instance.class_obj.students.all()
    for s in students:
        for p in s.parents.all():
            create_notif(p.user, "Mise à jour Emploi du Temps", msg, 'TIMETABLE')

@receiver(post_save, sender=Attendance)
def notify_attendance(sender, instance, created, **kwargs):
    if created and not instance.is_present:
        parents = instance.student.parents.all()
        for p in parents:
            create_notif(
                p.user,
                "Alerte Absence",
                f"Votre enfant {instance.student.first_name} a été marqué absent ce jour ({instance.date}).",
                'ATTENDANCE'
            )
