from django.urls import path
from .views import NotifyEmailView, NotifyHealthView

urlpatterns = [
    path('email/', NotifyEmailView.as_view(), name='notify-email'),
    path('health/', NotifyHealthView.as_view(), name='notify-health'),
]
