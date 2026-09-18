from rest_framework import serializers
from .models import (
    Class, Student, Subject, SchoolYear, Teacher, Parent, Grade, Attendance, 
    Term, TimetableEntry, Announcement, Enrollment, SiteSettings,
    Payment, Message, TeacherAttendance, Salary, HonorRoll
)
from django.contrib.auth.models import User

# ... existing serializers ...

class PaymentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    student_class_name = serializers.SerializerMethodField()
    student_class_id = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ['id', 'student', 'student_name', 'student_class_name', 'student_class_id', 'amount', 'payment_type', 'method', 'reference', 'receipt_number', 'date', 'notes', 'created_at']

    def get_student_name(self, obj):
        return str(obj.student) if obj.student else "N/A"

    def get_student_class_name(self, obj):
        return obj.student.student_class.name if obj.student and obj.student.student_class else "N/A"

    def get_student_class_id(self, obj):
        return obj.student.student_class.id if obj.student and obj.student.student_class else None

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = '__all__'
        read_only_fields = ['sender']

    def get_sender_name(self, obj):
        try:
            return obj.sender.get_full_name() or obj.sender.username
        except:
            return "Utilisateur inconnu"

    def get_receiver_name(self, obj):
        try:
            return obj.receiver.get_full_name() or obj.receiver.username
        except:
            return "Utilisateur inconnu"

class TeacherAttendanceSerializer(serializers.ModelSerializer):
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)

    class Meta:
        model = TeacherAttendance
        fields = '__all__'

class SalarySerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    role_type_display = serializers.CharField(source='get_role_type_display', read_only=True)

    class Meta:
        model = Salary
        fields = '__all__'

    def get_teacher_name(self, obj):
        try:
            if obj.employee_name:
                return obj.employee_name
            if obj.teacher and obj.teacher.user:
                full = f"{obj.teacher.user.first_name} {obj.teacher.user.last_name}".strip()
                return full if full else obj.teacher.user.username
            if obj.user:
                full = f"{obj.user.first_name} {obj.user.last_name}".strip()
                return full if full else obj.user.username
            return "Personnel non spécifié"
        except:
            return "N/A"

class UserBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

class SchoolYearSerializer(serializers.ModelSerializer):
    class Meta:
        model = SchoolYear
        fields = ['id', 'name', 'start_date', 'end_date', 'is_active', 'created_at']

class TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = Term
        fields = ['id', 'name', 'school_year', 'start_date', 'end_date', 'is_active']

class ClassSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(source='students.count', read_only=True)
    school_year_name = serializers.CharField(source='school_year.name', read_only=True)

    class Meta:
        model = Class
        fields = ['id', 'name', 'level', 'school_year', 'school_year_name', 'max_students', 'student_count', 'created_at']

class StudentSerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='student_class.name', read_only=True)
    parents_display = serializers.StringRelatedField(many=True, source='parents', read_only=True)
    photo = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'student_class', 'class_name', 'birth_date', 'created_at', 'parents_display', 'photo']

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name', 'code', 'coefficient', 'created_at']

class TeacherSerializer(serializers.ModelSerializer):
    user_details = UserBriefSerializer(source='user', read_only=True)
    subjects_display = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='name', source='subjects'
    )
    classes_display = serializers.SlugRelatedField(
        many=True, read_only=True, slug_field='name', source='classes'
    )
    
    class Meta:
        model = Teacher
        fields = ['id', 'user', 'user_details', 'subjects', 'subjects_display', 'classes', 'classes_display', 'bio']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        # Add phone from profile
        if hasattr(instance.user, 'profile'):
            ret['phone'] = instance.user.profile.phone
        return ret

class ParentSerializer(serializers.ModelSerializer):
    user_details = UserBriefSerializer(source='user', read_only=True)
    children_names = serializers.StringRelatedField(many=True, source='students', read_only=True)
    
    class Meta:
        model = Parent
        fields = ['id', 'user', 'user_details', 'students', 'children_names', 'address']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        if hasattr(instance.user, 'profile'):
            ret['phone_number'] = instance.user.profile.phone
            
        children = instance.students.all().select_related('student_class', 'student_class__school_year').prefetch_related('student_class__teachers__user')
        children_details = []
        for s in children:
            cls_name = s.student_class.name if s.student_class else ''
            cls_id = str(s.student_class.id) if s.student_class else ''
            year_name = s.student_class.school_year.name if (s.student_class and s.student_class.school_year) else ''
            year_id = str(s.student_class.school_year.id) if (s.student_class and s.student_class.school_year) else ''
            teachers = []
            if s.student_class:
                teachers = [f"Prof. {t.user.get_full_name() or t.user.username}" for t in s.student_class.teachers.all()]
            children_details.append({
                'id': str(s.id),
                'name': f"{s.first_name} {s.last_name}",
                'class_id': cls_id,
                'class_name': cls_name,
                'year_id': year_id,
                'year_name': year_name,
                'teachers': teachers,
            })
        ret['children_details'] = children_details
        return ret

class GradeSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.__str__', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    subject_coefficient = serializers.IntegerField(source='subject.coefficient', read_only=True)
    term_name = serializers.CharField(source='term.name', read_only=True)
    
    class Meta:
        model = Grade
        fields = ['id', 'student', 'student_name', 'subject', 'subject_name', 'subject_coefficient', 'term', 'term_name', 'teacher', 'value', 'max_value', 'comment', 'date']

class AttendanceSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.__str__', read_only=True)
    
    class Meta:
        model = Attendance
        fields = ['id', 'student', 'student_name', 'date', 'is_present', 'remark', 'teacher']

class TimetableEntrySerializer(serializers.ModelSerializer):
    class_name = serializers.CharField(source='class_obj.name', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.__str__', read_only=True)
    day_display = serializers.CharField(source='get_day_display', read_only=True)

    class Meta:
        model = TimetableEntry
        fields = ['id', 'class_obj', 'class_name', 'subject', 'subject_name', 'teacher', 'teacher_name', 'day', 'day_display', 'start_time', 'end_time', 'classroom']

class AnnouncementSerializer(serializers.ModelSerializer):
    target_role_display = serializers.CharField(source='get_target_role_display', read_only=True)
    author_name = serializers.SerializerMethodField()
    target_class_name = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'category', 'category_display', 'target_role', 'target_role_display', 'target_class', 'target_class_name', 'author', 'author_name', 'created_at']

    def get_author_name(self, obj):
        try:
            if obj.author:
                return obj.author.get_full_name() or obj.author.username
            return "Système"
        except:
            return "Admin"

    def get_target_class_name(self, obj):
        try:
            return obj.target_class.name if obj.target_class else "Toutes les classes"
        except:
            return "Classe inconnue"

class EnrollmentSerializer(serializers.ModelSerializer):
    target_class_name = serializers.CharField(source='target_class.name', read_only=True)
    school_year_name = serializers.CharField(source='school_year.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)

    class Meta:
        model = Enrollment
        fields = '__all__'

class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'

class HonorRollSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.__str__', read_only=True)
    term_name = serializers.CharField(source='term.name', read_only=True)
    distinction_display = serializers.CharField(source='get_distinction_display', read_only=True)

    class Meta:
        model = HonorRoll
        fields = ['id', 'student', 'student_name', 'term', 'term_name', 'average', 'position', 'distinction', 'distinction_display', 'created_at']

from .models import Assessment, GradeEntry

class AssessmentSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    term_name = serializers.CharField(source='term.name', read_only=True)
    teacher_name = serializers.CharField(source='teacher.user.get_full_name', read_only=True)

    class Meta:
        model = Assessment
        fields = ['id', 'name', 'subject', 'subject_name', 'term', 'term_name', 'teacher', 'teacher_name', 'date', 'max_score', 'created_at']

class GradeEntrySerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.__str__', read_only=True)
    assessment_name = serializers.CharField(source='assessment.name', read_only=True)
    
    class Meta:
        model = GradeEntry
        fields = ['id', 'assessment', 'assessment_name', 'student', 'student_name', 'score', 'comment', 'created_at', 'updated_at']
