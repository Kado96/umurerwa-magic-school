from django.contrib import admin
from .models import Class, Student, Subject, SchoolYear, Teacher, Parent, Grade, Attendance, Term, TimetableEntry, Announcement

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'target_class', 'author', 'created_at')
    list_filter = ('category', 'target_class', 'created_at')
    search_fields = ('title', 'content')

@admin.register(SchoolYear)
class SchoolYearAdmin(admin.ModelAdmin):
    list_display = ('name', 'start_date', 'end_date', 'is_active')
    list_filter = ('is_active',)

@admin.register(Term)
class TermAdmin(admin.ModelAdmin):
    list_display = ('name', 'school_year', 'start_date', 'end_date', 'is_active')
    list_filter = ('school_year', 'is_active')

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'school_year', 'max_students')
    list_filter = ('level', 'school_year')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'student_class', 'birth_date')
    list_filter = ('student_class',)
    search_fields = ('first_name', 'last_name')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    search_fields = ('name', 'code')

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
    filter_horizontal = ('subjects', 'classes')

@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('__str__',)
    filter_horizontal = ('students',)

@admin.register(Grade)
class GradeAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'value', 'max_value', 'term', 'date')
    list_filter = ('subject', 'term', 'date')

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'date', 'is_present')
    list_filter = ('date', 'is_present')

@admin.register(TimetableEntry)
class TimetableEntryAdmin(admin.ModelAdmin):
    list_display = ('class_obj', 'day', 'start_time', 'end_time', 'subject', 'teacher')
    list_filter = ('class_obj', 'day')
