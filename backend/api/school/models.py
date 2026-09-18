import uuid
from django.db import models
from django.contrib.auth.models import User

class SchoolYear(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50) # e.g. 2023-2024
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Term(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50) # ex: 1er Trimestre
    school_year = models.ForeignKey(SchoolYear, on_delete=models.CASCADE, related_name='terms')
    start_date = models.DateField()
    end_date = models.DateField()
    is_active = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.school_year.name})"

class Class(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=50)
    level = models.CharField(max_length=50)
    school_year = models.ForeignKey(SchoolYear, on_delete=models.CASCADE, related_name='classes', null=True, blank=True)
    max_students = models.IntegerField(default=40)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Student(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    student_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='students')
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class Subject(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    coefficient = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Teacher(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='teacher_profile')
    subjects = models.ManyToManyField(Subject, related_name='teachers')
    classes = models.ManyToManyField(Class, related_name='teachers')
    bio = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Prof. {self.user.get_full_name() or self.user.username}"

class Parent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='parent_profile')
    students = models.ManyToManyField(Student, related_name='parents')
    address = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Parent: {self.user.get_full_name() or self.user.username}"

class Grade(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='grades')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='grades')
    term = models.ForeignKey(Term, on_delete=models.CASCADE, related_name='grades', null=True, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True, related_name='given_grades')
    value = models.DecimalField(max_digits=5, decimal_places=2)
    max_value = models.DecimalField(max_digits=5, decimal_places=2, default=20)
    comment = models.TextField(blank=True, null=True)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.subject}: {self.value}/{self.max_value}"

class Attendance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    is_present = models.BooleanField(default=True)
    remark = models.TextField(blank=True, null=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.student} - {self.date}: {'Présent' if self.is_present else 'Absent'}"

class TimetableEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    DAYS = (
        (0, 'Lundi'), (1, 'Mardi'), (2, 'Mercredi'), 
        (3, 'Jeudi'), (4, 'Vendredi'), (5, 'Samedi')
    )
    class_obj = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='timetable_entries')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    day = models.IntegerField(choices=DAYS)
    start_time = models.TimeField()
    end_time = models.TimeField()
    classroom = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        ordering = ['day', 'start_time']

    def __str__(self):
        return f"{self.get_day_display()} - {self.class_obj.name}: {self.subject.name}"

class Announcement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    TYPES = (
        ('HOMEWORK', 'Devoir'),
        ('EXAM', 'Examen'),
        ('MEETING', 'Réunion'),
        ('EVENT', 'Événement'),
        ('GENERAL', 'Information Générale'),
    )
    ROLES = (
        ('ALL', 'Tout le monde'),
        ('TEACHER', 'Professeurs'),
        ('PARENT', 'Parents'),
    )
    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=20, choices=TYPES, default='GENERAL')
    target_role = models.CharField(max_length=10, choices=ROLES, default='ALL')
    target_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='announcements', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"

class Enrollment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('APPROVED', 'Approuvé'),
        ('REJECTED', 'Refusé'),
        ('COMPLETED', 'Inscrit'),
    )
    GENDER_CHOICES = (
        ('M', 'Masculin'),
        ('F', 'Féminin'),
    )
    
    # Student Info
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    birth_date = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    
    # Targeting
    target_class = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='enrollments')
    school_year = models.ForeignKey(SchoolYear, on_delete=models.SET_NULL, null=True, blank=True, related_name='enrollments')
    photo = models.ImageField(upload_to='enrollments_photos/', null=True, blank=True)
    
    # Parent Info
    parent_name = models.CharField(max_length=200)
    parent_email = models.EmailField()
    parent_phone = models.CharField(max_length=20)
    address = models.TextField()
    
    # Process
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Inscription: {self.first_name} {self.last_name} ({self.status})"

class SiteSettings(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    school_name = models.CharField(max_length=255, default="UMURERWA ACADEMY")
    slogan = models.CharField(max_length=255, default="Complexe Scolaire & Universitaire")
    hero_title = models.CharField(max_length=255, default="L'excellence académique de la maternelle à l'université.")
    hero_description = models.TextField(default="Umurerwa Academy offre un parcours d'études complet, rigoureux et moderne. De la petite enfance aux diplômes universitaires, nous formons les leaders et chercheurs de demain.")
    
    # 3 Badges d'accueil configurables
    badge_1_text = models.CharField(max_length=100, default="LMD & Cycles Homologués")
    badge_2_text = models.CharField(max_length=100, default="Campus & Amphithéâtres")
    badge_3_text = models.CharField(max_length=100, default="Recherche & Innovation")

    # Section "Notre Structure Académique" configurables
    about_title = models.CharField(max_length=255, default="Un cursus complet pour chaque étape de la vie")
    about_description = models.TextField(default="De la petite enfance aux diplômes universitaires, Umurerwa Academy met son corps professoral et ses infrastructures de pointe au service de la réussite académique et professionnelle.")
    
    # Carte Cursus 1 (Supérieur)
    card_1_title = models.CharField(max_length=150, default="Enseignement Supérieur & Facultés")
    card_1_subtitle = models.CharField(max_length=150, default="Licence, Master & Doctorat")
    card_1_desc = models.TextField(default="Formations universitaires diplômantes en Informatique, Gestion, Droit et Sciences Santé.")

    # Carte Cursus 2 (Lycée)
    card_2_title = models.CharField(max_length=150, default="Lycée & Enseignement Secondaire")
    card_2_subtitle = models.CharField(max_length=150, default="Sections Générales & Techniques")
    card_2_desc = models.TextField(default="Préparation rigoureuse aux examens d'État avec laboratoires et salles informatiques dédiées.")

    # Carte Cursus 3 (Primaire)
    card_3_title = models.CharField(max_length=150, default="École Primaire & Fondamentale")
    card_3_subtitle = models.CharField(max_length=150, default="Acquisition des fondamentaux")
    card_3_desc = models.TextField(default="Programme d'éveil aux sciences, langues et calcul dans une ambiance stimulante.")

    # Carte Cursus 4 (Maternelle)
    card_4_title = models.CharField(max_length=150, default="Maternelle & Éveil de l'Enfance")
    card_4_subtitle = models.CharField(max_length=150, default="Développement & Socialisation")
    card_4_desc = models.TextField(default="Espaces ludiques et sécurisés pour accompagner le développement psychomoteur et créatif.")

    # Section "Nos Activités & Épanouissement" configurables
    activities_title = models.CharField(max_length=255, default="Nos Activités & Épanouissement 🎨")
    activities_description = models.TextField(default="Un programme complet favorisant la créativité, l'esprit d'équipe et la passion d'apprendre.")

    # 6 Blocs d'activités
    act_1_title = models.CharField(max_length=100, default="Lecture & Recherches")
    act_2_title = models.CharField(max_length=100, default="Mathématiques & Sciences")
    act_3_title = models.CharField(max_length=100, default="Arts & Culture")
    act_4_title = models.CharField(max_length=100, default="Musique & Conférences")
    act_5_title = models.CharField(max_length=100, default="Sports & Compétitions")
    act_6_title = models.CharField(max_length=100, default="Langues & International")

    # Galerie & Défilement Infini (6 photos + titres)
    gallery_title = models.CharField(max_length=255, default="Galerie de la Vie Scolaire (Défilement Infini)")
    gallery_img_1 = models.TextField(default="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop")
    gallery_caption_1 = models.CharField(max_length=150, default="Bibliothèque & Lecture")

    gallery_img_2 = models.TextField(default="https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop")
    gallery_caption_2 = models.CharField(max_length=150, default="Laboratoire & Sciences")

    gallery_img_3 = models.TextField(default="https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=600&auto=format&fit=crop")
    gallery_caption_3 = models.CharField(max_length=150, default="Atelier Peinture & Arts")

    gallery_img_4 = models.TextField(default="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop")
    gallery_caption_4 = models.CharField(max_length=150, default="Activités Sportives")

    gallery_img_5 = models.TextField(default="https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop")
    gallery_caption_5 = models.CharField(max_length=150, default="Travaux en groupe & Projets")

    gallery_img_6 = models.TextField(default="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=600&auto=format&fit=crop")
    gallery_caption_6 = models.CharField(max_length=150, default="Vie du Campus & Événements")

    # Images du carrousel
    carousel_img_1 = models.TextField(default="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop")
    carousel_caption_1 = models.CharField(max_length=150, default="Campus Universitaire & Recherche")
    carousel_img_2 = models.TextField(default="https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1200&auto=format&fit=crop")
    carousel_caption_2 = models.CharField(max_length=150, default="Facultés & Salles d'Amphithéâtre")
    carousel_img_3 = models.TextField(default="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop")
    carousel_caption_3 = models.CharField(max_length=150, default="Maternelle, Primaire & Secondaire")
    carousel_img_4 = models.TextField(default="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop")
    carousel_caption_4 = models.CharField(max_length=150, default="Laboratoires Informatiques & Innovation")

    # Personnalisation des polices et couleurs
    title_font_size = models.IntegerField(default=52) # Taille de police du titre en px
    body_font_size = models.IntegerField(default=18)  # Taille du texte en px
    primary_color = models.CharField(max_length=20, default="#1e3a8a") # Bleu marine institutionnel
    accent_color = models.CharField(max_length=20, default="#f59e0b")  # Or / Ambre
    bg_color = models.CharField(max_length=20, default="#f8fafc")      # Fond clair
    
    logo = models.TextField(null=True, blank=True)
    hero_image = models.TextField(null=True, blank=True)
    
    # Contact Info & Pied de Page (Footer)
    footer_tagline = models.CharField(max_length=255, default="L'excellence académique & l'épanouissement de chaque élève et étudiant. 🌟")
    footer_copyright = models.CharField(max_length=255, default="pour Umurerwa Academy")
    address = models.CharField(max_length=255, default="Bujumbura, Burundi")
    phone = models.CharField(max_length=50, default="+257 68 00 00 00")
    email = models.EmailField(default="contact@umurerwa-academy.bi")

    def save(self, *args, **kwargs):
        if not self.pk and SiteSettings.objects.exists():
            existing = SiteSettings.objects.first()
            self.pk = existing.pk
        return super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj = cls.objects.first()
        if not obj:
            obj = cls.objects.create()
        return obj

    def __str__(self):
        return "Paramètres du Site"

class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    PAYMENT_TYPES = (
        ('MINERVAL', 'Frais Scolaires'),
        ('INSCRIPTION', 'Inscription'),
        ('AUTRE', 'Autre Frais'),
    )
    METHODS = (
        ('CASH', 'Espèces'),
        ('BANK', 'Banque'),
        ('MOBILE_MONEY', 'Mobile Money'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES, default='MINERVAL')
    method = models.CharField(max_length=20, choices=METHODS, default='CASH')
    reference = models.CharField(max_length=100, blank=True, null=True)
    date = models.DateField()
    notes = models.TextField(blank=True, null=True)
    receipt_number = models.CharField(max_length=50, unique=True, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.receipt_number:
            import datetime
            prefix = "REC"
            date_str = datetime.datetime.now().strftime("%Y%m%d")
            # Simple unique number generation
            count = Payment.objects.filter(created_at__date=datetime.date.today()).count() + 1
            self.receipt_number = f"{prefix}-{date_str}-{count:04d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student} - {self.amount} ({self.payment_type})"

class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"De {self.sender} à {self.receiver}"

class TeacherAttendance(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = (
        ('PRESENT', 'Présent'),
        ('ABSENT', 'Absent'),
        ('LATE', 'En retard'),
    )
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='attendances')
    date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PRESENT')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('teacher', 'date')

class Salary(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    STATUS_CHOICES = (
        ('PENDING', 'En attente'),
        ('PAID', 'Payé'),
    )
    ROLE_TYPE_CHOICES = (
        ('TEACHER', 'Professeur'),
        ('SECRETARY', 'Secrétaire'),
        ('STAFF', 'Personnel / Platon'),
        ('ACCOUNTANT', 'Comptable'),
        ('DIRECTOR', 'Directeur'),
        ('OTHER', 'Autre Personnel'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='salaries', null=True, blank=True)
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name='salaries', null=True, blank=True)
    employee_name = models.CharField(max_length=200, blank=True, default='') # Pour personnel personnalisé ou fallback
    role_type = models.CharField(max_length=20, choices=ROLE_TYPE_CHOICES, default='TEACHER')
    month = models.CharField(max_length=7) # Format YYYY-MM
    base_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_method = models.CharField(max_length=20, default='BANK')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)

class HonorRoll(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    DISTINCTIONS = (
        ('SATISFACTION', 'Satisfaction'),
        ('DISTINCTION', 'Distinction'),
        ('GRANDE_DISTINCTION', 'Grande Distinction'),
    )
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='honor_roll_entries')
    term = models.ForeignKey(Term, on_delete=models.CASCADE)
    average = models.DecimalField(max_digits=4, decimal_places=2)
    position = models.IntegerField()
    distinction = models.CharField(max_length=20, choices=DISTINCTIONS)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'term')
        ordering = ['-average']

class Assessment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    subject = models.ForeignKey('Subject', on_delete=models.CASCADE, related_name='assessments')
    term = models.ForeignKey('Term', on_delete=models.CASCADE, related_name='assessments')
    teacher = models.ForeignKey('Teacher', on_delete=models.CASCADE, related_name='assessments')
    date = models.DateField()
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=20.00)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - {self.subject} ({self.date})"

class GradeEntry(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    assessment = models.ForeignKey(Assessment, on_delete=models.CASCADE, related_name='grade_entries')
    student = models.ForeignKey('Student', on_delete=models.CASCADE, related_name='grade_entries')
    score = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('assessment', 'student')
        
    def __str__(self):
        return f"{self.student} - {self.assessment}: {self.score}"
