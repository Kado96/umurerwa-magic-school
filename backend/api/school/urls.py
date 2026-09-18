from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClassViewSet, StudentViewSet, SubjectViewSet, 
    SchoolYearViewSet, TeacherViewSet, ParentViewSet,
    GradeViewSet, AttendanceViewSet, TermViewSet,
    TimetableEntryViewSet, AnnouncementViewSet, EnrollmentViewSet,
    SiteSettingsViewSet, PaymentViewSet, MessageViewSet,
    TeacherAttendanceViewSet, SalaryViewSet, DashboardViewSet, HonorRollViewSet
)

router = DefaultRouter()
router.register(r'classes', ClassViewSet)
router.register(r'students', StudentViewSet)
router.register(r'subjects', SubjectViewSet)
router.register(r'school_years', SchoolYearViewSet)
router.register(r'teachers', TeacherViewSet)
router.register(r'parents', ParentViewSet)
router.register(r'grades', GradeViewSet, basename='grade')
router.register(r'attendances', AttendanceViewSet, basename='attendance')
router.register(r'terms', TermViewSet)
router.register(r'timetable', TimetableEntryViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'enrollments', EnrollmentViewSet)
router.register(r'settings', SiteSettingsViewSet, basename='site-settings')
router.register(r'payments', PaymentViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'teacher-attendance', TeacherAttendanceViewSet)
router.register(r'salaries', SalaryViewSet)
router.register(r'dashboard', DashboardViewSet, basename='dashboard')
router.register(r'excellence', HonorRollViewSet, basename='excellence')
from .views import AssessmentViewSet, GradeEntryViewSet, MediaUploadView
router.register(r'assessments', AssessmentViewSet)
router.register(r'grade-entries', GradeEntryViewSet)

urlpatterns = [
    path('media/upload/', MediaUploadView.as_view(), name='media-upload'),
    path('', include(router.urls)),
]
