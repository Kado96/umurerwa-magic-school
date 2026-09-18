from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4, A5
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
import io

from .models import (
    Class, Student, Subject, SchoolYear, Teacher, Parent, Grade, Attendance, 
    Term, TimetableEntry, Announcement, Enrollment, SiteSettings,
    Payment, Message, TeacherAttendance, Salary, HonorRoll
)
from django.db import models
from django.db.models import Avg, Sum, Count
from django.contrib.auth import get_user_model

User = get_user_model()
from .serializers import (
    ClassSerializer, StudentSerializer, SubjectSerializer, 
    SchoolYearSerializer, TeacherSerializer, ParentSerializer, 
    GradeSerializer, AttendanceSerializer, TermSerializer,
    TimetableEntrySerializer, AnnouncementSerializer, EnrollmentSerializer,
    SiteSettingsSerializer, PaymentSerializer, MessageSerializer,
    TeacherAttendanceSerializer, SalarySerializer, HonorRollSerializer
)

class SiteSettingsViewSet(viewsets.ModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_object(self):
        return SiteSettings.load()

    def list(self, request, *args, **kwargs):
        instance = SiteSettings.load()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = SiteSettings.load()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = SiteSettings.load()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

class SchoolYearViewSet(viewsets.ModelViewSet):
    queryset = SchoolYear.objects.all()
    serializer_class = SchoolYearSerializer
    permission_classes = [IsAuthenticated]

class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Class.objects.none()
        
        role = user.profile.role
        if role == 'TEACHER':
            return Class.objects.filter(teachers__user=user).distinct()
        elif role == 'PARENT':
            return Class.objects.filter(students__parents__user=user).distinct()
        return Class.objects.all()

class TermViewSet(viewsets.ModelViewSet):
    queryset = Term.objects.all()
    serializer_class = TermSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Term.objects.all()

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Student.objects.none()
        
        role = user.profile.role
        if role == 'PARENT':
            return Student.objects.filter(parents__user=user)
        elif role == 'TEACHER':
            return Student.objects.filter(student_class__teachers__user=user).distinct()
        return Student.objects.all()

    @action(detail=True, methods=['get'])
    def export_bulletin(self, request, pk=None):
        student = self.get_object()
        term_id = request.query_params.get('term_id')
        
        if not term_id:
            return Response({"error": "term_id est requis"}, status=400)
            
        try:
            term = Term.objects.get(id=term_id)
        except Term.DoesNotExist:
            return Response({"error": "Période invalide"}, status=404)

        grades = Grade.objects.filter(student=student, term_id=term_id).select_related('subject')
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)
        elements = []
        styles = getSampleStyleSheet()
        
        # Styles
        title_style = styles['Title']
        title_style.textColor = colors.HexColor("#1e3a8a")
        title_style.fontSize = 22
        
        # En-tête
        elements.append(Paragraph("ÉCOLE UMURERWA MAGIC", title_style))
        elements.append(Paragraph("<i>Excellence - Innovation - Réussite</i>", styles['Normal']))
        elements.append(Spacer(1, 30))
        
        # Infos
        elements.append(Paragraph(f"<b>BULLETIN DE NOTES :</b> {term.name}", styles['Heading2']))
        elements.append(Spacer(1, 10))
        elements.append(Paragraph(f"<b>Élève :</b> {student.first_name} {student.last_name}", styles['Normal']))
        elements.append(Paragraph(f"<b>Classe :</b> {student.student_class.name if student.student_class else 'N/A'}", styles['Normal']))
        elements.append(Paragraph(f"<b>Année :</b> {term.school_year.name}", styles['Normal']))
        elements.append(Spacer(1, 20))
        
        # Calculs
        subject_data = {}
        for g in grades:
            sid = g.subject.id
            if sid not in subject_data:
                subject_data[sid] = {
                    'name': g.subject.name,
                    'coefficient': g.subject.coefficient,
                    'sum_notes': 0,
                    'count': 0,
                    'max_value': float(g.max_value)
                }
            subject_data[sid]['sum_notes'] += float(g.value)
            subject_data[sid]['count'] += 1

        # Table
        data = [['Matière', 'Coef.', 'Moyenne /20', 'Total Pondéré', 'Appréciation']]
        
        total_weighted_points = 0
        total_coefficients = 0
        
        for sid, info in subject_data.items():
            # Ramener la note sur 20
            avg_raw = info['sum_notes'] / info['count']
            avg_20 = (avg_raw * 20) / info['max_value']
            weighted = avg_20 * info['coefficient']
            
            total_weighted_points += weighted
            total_coefficients += info['coefficient']
            
            # Appréciation simple
            if avg_20 >= 16: appr = "Excellent"
            elif avg_20 >= 14: appr = "Très Bien"
            elif avg_20 >= 12: appr = "Bien"
            elif avg_20 >= 10: appr = "Passable"
            else: appr = "Insuffisant"
            
            data.append([
                info['name'],
                str(info['coefficient']),
                f"{avg_20:.2f}",
                f"{weighted:.2f}",
                appr
            ])
            
        # Ligne de Moyenne Générale
        if total_coefficients > 0:
            gen_avg = total_weighted_points / total_coefficients
            data.append([
                'MOYENNE GÉNÉRALE',
                str(total_coefficients),
                f'{gen_avg:.2f} / 20',
                f'{total_weighted_points:.2f}',
                'ADMIS' if gen_avg >= 10 else 'ÉCHEC'
            ])
            
        t = Table(data, colWidths=[160, 40, 90, 90, 100])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor("#1e3a8a")),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, -1), (-1, -1), colors.HexColor("#cbd5e1")),
            ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        
        elements.append(t)
        
        # Signatures
        elements.append(Spacer(1, 50))
        sig_data = [["Signature du Professeur", "", "Sceau de l'Établissement"]]
        sig_table = Table(sig_data, colWidths=[200, 80, 200])
        sig_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica-Bold'),
        ]))
        elements.append(sig_table)

        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="bulletin_{student.last_name}_{term.name}.pdf"'
        response.write(pdf)
        return response

class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]

class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Teacher.objects.none()
        
        role = user.profile.role
        if role == 'PARENT':
            # Professeurs des enfants de ce parent
            return Teacher.objects.filter(classes__students__parents__user=user).distinct()
        return Teacher.objects.all()

    def create(self, request, *args, **kwargs):
        from django.contrib.auth.models import User
        from api.accounts.models import Profile

        data = request.data
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        email = data.get('email', '')

        if not username or not password:
            return Response({"error": "Nom d'utilisateur et mot de passe requis"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": f"L'utilisateur {username} existe déjà"}, status=400)

        # 1. Créer le compte User
        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        # 2. Créer ou mettre à jour le Profile avec le rôle TEACHER
        profile, _ = Profile.objects.get_or_create(user=user)
        profile.role = 'TEACHER'
        profile.save()

        # 3. Créer l'instance Teacher
        teacher = Teacher.objects.create(
            user=user,
            bio=data.get('bio', '')
        )

        if 'subjects' in data and isinstance(data['subjects'], list):
            teacher.subjects.set(data['subjects'])
        if 'classes' in data and isinstance(data['classes'], list):
            teacher.classes.set(data['classes'])

        serializer = self.get_serializer(teacher)
        return Response(serializer.data, status=201)

class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    def get_queryset(self):
        user = self.request.user
        if not hasattr(user, 'profile'):
            return Parent.objects.none()
        
        role = user.profile.role
        if role == 'TEACHER':
            return Parent.objects.filter(students__student_class__teachers__user=user).distinct()
        return Parent.objects.all()

    def create(self, request, *args, **kwargs):
        from django.contrib.auth.models import User
        from api.accounts.models import Profile

        data = request.data
        username = data.get('username')
        password = data.get('password')
        first_name = data.get('first_name', '')
        last_name = data.get('last_name', '')
        email = data.get('email', '')

        if not username or not password:
            return Response({"error": "Nom d'utilisateur et mot de passe requis"}, status=400)

        if User.objects.filter(username=username).exists():
            return Response({"error": f"L'utilisateur {username} existe déjà"}, status=400)

        user = User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name,
            email=email
        )

        profile, _ = Profile.objects.get_or_create(user=user)
        profile.role = 'PARENT'
        profile.save()

        parent = Parent.objects.create(
            user=user,
            address=data.get('address', '')
        )

        if 'students' in data and isinstance(data['students'], list):
            parent.students.set(data['students'])

        serializer = self.get_serializer(parent)
        return Response(serializer.data, status=201)

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def export_report(self, request):
        # Logique d'exportation Excel simplifiée pour la démo
        return Response({"message": "Export simulé"})

    @action(detail=True, methods=['get'])
    def export_receipt(self, request, pk=None):
        payment = self.get_object()
        
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A5, rightMargin=20, leftMargin=20, topMargin=20, bottomMargin=10)
        elements = []
        styles = getSampleStyleSheet()
        
        # Styles
        title_style = styles['Title']
        title_style.fontSize = 18
        
        # Header
        elements.append(Paragraph("REÇU DE PAIEMENT", title_style))
        elements.append(Spacer(1, 15))
        
        # Info
        data = [
            ["N° Reçu:", payment.receipt_number],
            ["Date:", str(payment.date)],
            ["Élève:", str(payment.student)],
            ["Classe:", payment.student.student_class.name if payment.student.student_class else "N/A"],
            ["Type:", payment.get_payment_type_display()],
            ["Montant:", f"{payment.amount:,.2f} BIF"],
            ["Méthode:", payment.get_method_display()],
            ["Référence:", payment.reference or "N/A"],
        ]
        
        table = Table(data, colWidths=[100, 200])
        table.setStyle(TableStyle([
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('BACKGROUND', (0, 0), (0, -1), colors.whitesmoke),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('PADDING', (0, 0), (-1, -1), 8),
        ]))
        elements.append(table)
        elements.append(Spacer(1, 30))
        
        # Signatures
        sig_data = [["Signature Caissier", "", "Signature Parent"]]
        sig_table = Table(sig_data, colWidths=[120, 60, 120])
        elements.append(sig_table)
        
        doc.build(elements)
        pdf = buffer.getvalue()
        buffer.close()
        
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="recu_{payment.receipt_number}.pdf"'
        response.write(pdf)
        return response

    @action(detail=False, methods=['post'])
    def send_reminders(self, request):
        parents = Parent.objects.all()
        count = 0
        for parent in parents:
            Message.objects.create(
                sender=request.user,
                receiver=parent.user,
                content="RAPPEL: Veuillez régulariser les frais scolaires de vos enfants pour le trimestre en cours. Merci."
            )
            count += 1
        return Response({"message": f"Rappels envoyés à {count} parents."})

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(models.Q(sender=user) | models.Q(receiver=user)).order_by('created_at')

    @action(detail=False, methods=['get'])
    def contacts(self, request):
        user = request.user
        contacts_data = []

        # Si l'utilisateur est un superutilisateur ou n'a pas de profil, lui attribuer le rôle ADMIN par défaut
        role = getattr(getattr(user, 'profile', None), 'role', 'ADMIN')
        if user.is_superuser:
            role = 'ADMIN'

        try:
            if role == 'PARENT':
                teachers = Teacher.objects.all().select_related('user')
                for t in teachers:
                    if t.user and t.user != user:
                        contacts_data.append({
                            'id': str(t.user.id),
                            'name': f"Prof. {t.user.get_full_name() or t.user.username}",
                            'role_display': "Enseignant",
                            'role': 'TEACHER'
                        })

                admins = User.objects.filter(models.Q(profile__role='ADMIN') | models.Q(is_superuser=True)).exclude(id=user.id).distinct()
                for a in admins:
                    contacts_data.append({
                        'id': str(a.id),
                        'name': f"Direction - {a.get_full_name() or a.username}",
                        'role_display': "Administration",
                        'role': 'ADMIN'
                    })

            elif role == 'TEACHER':
                parents = Parent.objects.all().select_related('user')
                for p in parents:
                    if p.user and p.user != user:
                        contacts_data.append({
                            'id': str(p.user.id),
                            'name': f"Parent - {p.user.get_full_name() or p.user.username}",
                            'role_display': "Parent d'Élève",
                            'role': 'PARENT'
                        })

                admins = User.objects.filter(models.Q(profile__role='ADMIN') | models.Q(is_superuser=True)).exclude(id=user.id).distinct()
                for a in admins:
                    contacts_data.append({
                        'id': str(a.id),
                        'name': f"Direction - {a.get_full_name() or a.username}",
                        'role_display': "Administration",
                        'role': 'ADMIN'
                    })

            else:
                # ADMIN ou tout autre rôle : accès à tous les utilisateurs sauf soi-même
                all_users = User.objects.exclude(id=user.id)
                for u in all_users:
                    u_role = 'OTHER'
                    r_disp = "Utilisateur"
                    if hasattr(u, 'profile') and u.profile:
                        u_role = u.profile.role
                        if u_role == 'TEACHER': r_disp = "Enseignant"
                        elif u_role == 'PARENT': r_disp = "Parent d'Élève"
                        elif u_role == 'ADMIN': r_disp = "Administration"
                    elif u.is_superuser:
                        u_role = 'ADMIN'
                        r_disp = "Administration"

                    contacts_data.append({
                        'id': str(u.id),
                        'name': f"{u.get_full_name() or u.username}",
                        'role_display': r_disp,
                        'role': u_role
                    })
        except Exception as e:
            # Sécurité fallback en cas d'anomalie de schéma
            print("Erreur contacts:", e)
            all_users = User.objects.exclude(id=user.id)
            for u in all_users:
                contacts_data.append({
                    'id': str(u.id),
                    'name': u.get_full_name() or u.username,
                    'role_display': "Contact",
                    'role': 'USER'
                })

        return Response(contacts_data)

class TeacherAttendanceViewSet(viewsets.ModelViewSet):
    queryset = TeacherAttendance.objects.all()
    serializer_class = TeacherAttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        date = self.request.query_params.get('date')
        if date:
            return self.queryset.filter(date=date)
        return self.queryset

    def create(self, request, *args, **kwargs):
        teacher_id = request.data.get('teacher')
        date = request.data.get('date')
        status = request.data.get('status')

        # Logique d'upsert (Update or Create)
        attendance, created = TeacherAttendance.objects.update_or_create(
            teacher_id=teacher_id,
            date=date,
            defaults={'status': status}
        )
        
        serializer = self.get_serializer(attendance)
        return Response(serializer.data, status=201 if created else 200)

class SalaryViewSet(viewsets.ModelViewSet):
    queryset = Salary.objects.all()
    serializer_class = SalarySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def export_payroll(self, request):
        return Response({"message": "Payroll export simulated"})

class DashboardViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        user = self.request.user
        if hasattr(user, 'profile'):
            role = user.profile.role
        else:
            role = 'ADMIN' if user.is_superuser else 'PARENT'
        
        try:
            if role == 'ADMIN':
                data = {
                    "total_students": Student.objects.count(),
                    "pass_rate": 88,
                    "collection_rate": 91,
                    "attendance_rate": 94,
                    "total_classes": Class.objects.count(),
                    "total_teachers": Teacher.objects.count(),
                    "total_subjects": Subject.objects.count(),
                    "total_collected": 12500000,
                    "total_due": 1500000
                }
            elif role == 'TEACHER':
                teacher = getattr(user, 'teacher_profile', None)
                if not teacher:
                    data = {"total_students": 0, "total_classes": 0, "attendance_rate": 0, "pass_rate": 0, "class_performance": []}
                else:
                    classes = teacher.classes.all()
                    students_count = Student.objects.filter(student_class__in=classes).distinct().count()
                    
                    class_perf = []
                    for cls in classes:
                        try:
                            avg_val = Grade.objects.filter(student__student_class=cls, teacher__user=user).aggregate(Avg('value'))['value__avg']
                            class_perf.append({"name": cls.name, "score": round(float(avg_val), 1) if avg_val is not None else 0})
                        except:
                            class_perf.append({"name": cls.name, "score": 0})
                    
                    data = {
                        "total_students": students_count,
                        "total_classes": classes.count(),
                        "attendance_rate": 94,
                        "pass_rate": 82,
                        "class_performance": class_perf
                    }
            else: # PARENT
                children = Student.objects.filter(parents__user=user)
                child_perf = []
                try:
                    if children.exists():
                        c = children.first()
                        perf = Grade.objects.filter(student=c).values('subject__name').annotate(avg=Avg('value'))
                        for p in perf:
                            child_perf.append({"subject": p['subject__name'], "score": round(float(p['avg']), 1)})
                except:
                    pass

                data = {
                    "total_children": children.count(),
                    "attendance_rate": 98,
                    "notes_count": Grade.objects.filter(student__parents__user=user).count(),
                    "child_performance": child_perf
                }
            from django.conf import settings
            data["debug_db_path"] = str(settings.DATABASES['default']['NAME'])
            return Response(data)
        except Exception as e:
            # Fallback total en cas d'erreur DB
            return Response({"error": str(e), "fallback": True, "total_students": 0})

    @action(detail=False, methods=['get'])
    def academic_stats(self, request):
        try:
            # Top 5 des élèves par moyenne
            stats = Student.objects.annotate(
                avg_grade=Avg('grades__value', filter=models.Q(grades__max_value=20))
            ).order_by('-avg_grade')[:5]
            
            results = []
            for s in stats:
                class_name = "Sans classe"
                if s.student_class_id:
                    try:
                        class_name = s.student_class.name
                    except Exception:
                        class_name = "Classe Inconnue"
                
                results.append({
                    "student_name": f"{s.first_name} {s.last_name}",
                    "class_name": class_name,
                    "average": round(float(s.avg_grade), 1) if s.avg_grade is not None else 0
                })
            
            return Response(results)
        except Exception as e:
            print(f"DEBUG ACADEMIC_STATS ERROR: {e}")
            import traceback
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)

class GradeViewSet(viewsets.ModelViewSet):
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile'):
            if user.profile.role == 'PARENT':
                # Un parent ne voit que les notes de ses enfants
                return Grade.objects.filter(student__parents__user=user)
            elif user.profile.role == 'TEACHER':
                # Un professeur voit les notes qu'il a données
                return Grade.objects.filter(teacher__user=user)
        return Grade.objects.all()

class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if hasattr(user, 'profile'):
            if user.profile.role == 'PARENT':
                return Attendance.objects.filter(student__parents__user=user)
            elif user.profile.role == 'TEACHER':
                return Attendance.objects.filter(teacher__user=user)
        return Attendance.objects.all()

class TimetableEntryViewSet(viewsets.ModelViewSet):
    queryset = TimetableEntry.objects.all()
    serializer_class = TimetableEntrySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = TimetableEntry.objects.all()
        class_id = self.request.query_params.get('class_id')
        if class_id:
            qs = qs.filter(class_obj_id=class_id)
        if hasattr(user, 'profile'):
            if user.profile.role == 'PARENT':
                # Parent voit l'emploi du temps de ses enfants
                return qs.filter(class_obj__students__parents__user=user).distinct()
            elif user.profile.role == 'TEACHER':
                # Professeur voit son propre planning
                return qs.filter(teacher__user=user)
        return qs

class AnnouncementViewSet(viewsets.ModelViewSet):
    queryset = Announcement.objects.all()
    serializer_class = AnnouncementSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Announcement.objects.all().order_by('-created_at')
        class_id = self.request.query_params.get('class_id')
        
        if class_id:
            qs = qs.filter(target_class_id=class_id)
            
        if not user.is_superuser and hasattr(user, 'profile'):
            role = user.profile.role
            if role == 'PARENT':
                return qs.filter(
                    models.Q(target_role__in=['ALL', 'PARENT']),
                    models.Q(target_class__students__parents__user=user) | models.Q(target_class__isnull=True)
                ).distinct()
            elif role == 'TEACHER':
                return qs.filter(
                    models.Q(target_role__in=['ALL', 'TEACHER']),
                    models.Q(target_class__teachers__user=user) | models.Q(target_class__isnull=True)
                ).distinct()
        
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class EnrollmentViewSet(viewsets.ModelViewSet):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [] # Inscription publique
        return [IsAuthenticated()]

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def approve(self, request, pk=None):
        enrollment = self.get_object()
        if enrollment.status == 'COMPLETED':
            return Response({"error": "Demande déjà approuvée et élève déjà créé"}, status=400)
            
        # Création de l'élève s'il n'existe pas encore
        student = Student.objects.create(
            first_name=enrollment.first_name,
            last_name=enrollment.last_name,
            student_class=enrollment.target_class,
            birth_date=enrollment.birth_date,
            school_year=enrollment.school_year,
            photo=enrollment.photo
        )
        
        enrollment.status = 'COMPLETED'
        enrollment.save()
        
        return Response({"message": f"Élève {student.first_name} {student.last_name} créé avec succès", "student_id": student.id})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def reject(self, request, pk=None):
        enrollment = self.get_object()
        enrollment.status = 'REJECTED'
        enrollment.save()
        return Response({"message": "Demande d'inscription refusée."})

class HonorRollViewSet(viewsets.ModelViewSet):
    queryset = HonorRoll.objects.all()
    serializer_class = HonorRollSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def calculate(self, request):
        term_id = request.data.get('term_id')
        class_id = request.data.get('class_id')
        
        if not term_id or not class_id:
            return Response({"error": "term_id et class_id sont requis"}, status=400)
            
        # Calculer les moyennes pour tous les élèves de la classe
        students = Student.objects.filter(student_class_id=class_id)
        results = []
        
        for student in students:
            # On utilise le même filtre que pour le dashboard
            avg_val = Grade.objects.filter(
                student=student, 
                term_id=term_id
            ).aggregate(Avg('value'))['value__avg']
            
            if avg_val is not None:
                results.append({
                    'student': student,
                    'average': float(avg_val)
                })
        
        # Trier par moyenne décroissante
        results.sort(key=lambda x: x['average'], reverse=True)
        
        # Sauvegarder/Mettre à jour le tableau d'honneur
        honor_entries = []
        for i, res in enumerate(results):
            avg = res['average']
            distinction = 'SATISFACTION'
            if avg >= 18: distinction = 'GRANDE_DISTINCTION'
            elif avg >= 16: distinction = 'DISTINCTION'
            
            entry, created = HonorRoll.objects.update_or_create(
                student=res['student'],
                term_id=term_id,
                defaults={
                    'average': avg,
                    'position': i + 1,
                    'distinction': distinction
                }
            )
            honor_entries.append(entry)
            
        return Response({
            "message": f"Tableau d'honneur calculé pour {len(honor_entries)} élèves",
            "results": HonorRollSerializer(honor_entries, many=True).data
        })

from .models import Assessment, GradeEntry
from .serializers import AssessmentSerializer, GradeEntrySerializer
from rest_framework.decorators import action

class AssessmentViewSet(viewsets.ModelViewSet):
    queryset = Assessment.objects.all()
    serializer_class = AssessmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='batch-grades')
    def batch_grades(self, request, pk=None):
        assessment = self.get_object()
        grades_data = request.data.get('grades', [])
        
        updated_grades = []
        for grade_data in grades_data:
            student_id = grade_data.get('student_id')
            score = grade_data.get('score')
            comment = grade_data.get('comment', '')
            
            if student_id is not None and score is not None:
                grade_entry, created = GradeEntry.objects.update_or_create(
                    assessment=assessment,
                    student_id=student_id,
                    defaults={'score': score, 'comment': comment}
                )
                updated_grades.append(grade_entry)
                
        serializer = GradeEntrySerializer(updated_grades, many=True)
        return Response({'status': 'success', 'grades': serializer.data})

class GradeEntryViewSet(viewsets.ModelViewSet):
    queryset = GradeEntry.objects.all()
    serializer_class = GradeEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
import os
import uuid

class MediaUploadView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({"error": "Aucun fichier fourni"}, status=400)

        category = request.query_params.get('category', 'general')
        media_dir = os.path.join(settings.MEDIA_ROOT, category)
        os.makedirs(media_dir, exist_ok=True)

        ext = os.path.splitext(file_obj.name)[1] or '.jpg'
        unique_name = f"{uuid.uuid4().hex}{ext}"
        file_path = os.path.join(media_dir, unique_name)

        with open(file_path, 'wb+') as destination:
            for chunk in file_obj.chunks():
                destination.write(chunk)

        relative_url = f"{settings.MEDIA_URL}{category}/{unique_name}"
        full_url = request.build_absolute_uri(relative_url)

        return Response({
            "url": full_url,
            "relative_url": relative_url,
            "filename": file_obj.name
        }, status=201)

