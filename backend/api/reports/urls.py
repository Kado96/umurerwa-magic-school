from django.urls import path
from .views import SendWeeklyReportView, SendPaymentAlertView

urlpatterns = [
    path('send-weekly/', SendWeeklyReportView.as_view(), name='report-weekly'),
    path('send-payment-alert/', SendPaymentAlertView.as_view(), name='report-payment-alert'),
]
