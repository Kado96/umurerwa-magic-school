"""
Endpoints de génération et envoi de rapports email.
POST /api/reports/send-weekly/ → envoie le rapport hebdomadaire
POST /api/reports/send-payment-alert/ → envoie une alerte paiement
"""
import os
import json
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from api.notify.mail import send_html_email
from api.notify.views import authorize_request
from .email_templates import build_weekly_summary_html, build_payment_alert_html


@method_decorator(csrf_exempt, name='dispatch')
class SendWeeklyReportView(View):
    """POST /api/reports/send-weekly/"""

    def post(self, request):
        if not authorize_request(request):
            return JsonResponse({'error': 'Secret notify invalide'}, status=401)

        try:
            body = json.loads(request.body or '{}')
        except Exception:
            body = {}

        to = body.get('to', os.environ.get('GMAIL_USER', ''))

        # Statistiques de base (à enrichir avec tes modèles réels)
        week_start = (datetime.now() - timedelta(days=7)).strftime('%d/%m/%Y')

        stats = {
            'week_start': week_start,
            'total_students': body.get('total_students', 0),
            'total_courses': body.get('total_courses', 0),
            'payments_received': body.get('payments_received', 0),
            'payments_pending': body.get('payments_pending', 0),
            'total_teachers': body.get('total_teachers', 0),
            'alerts': body.get('alerts', ''),
        }

        html = build_weekly_summary_html(stats)
        subject = f"Rapport Hebdomadaire Umurerwa - Semaine du {week_start}"

        try:
            result = send_html_email(to=to, subject=subject, html=html)
            return JsonResponse({'ok': True, 'sent_to': to, **result})
        except Exception as err:
            return JsonResponse({'error': str(err)}, status=502)


@method_decorator(csrf_exempt, name='dispatch')
class SendPaymentAlertView(View):
    """POST /api/reports/send-payment-alert/"""

    def post(self, request):
        if not authorize_request(request):
            return JsonResponse({'error': 'Secret notify invalide'}, status=401)

        try:
            body = json.loads(request.body or '{}')
        except Exception:
            return JsonResponse({'error': 'Body JSON invalide'}, status=400)

        to = body.get('to', os.environ.get('GMAIL_USER', ''))
        student_name = body.get('student_name', 'Inconnu')
        amount = body.get('amount', 0)
        due_date = body.get('due_date', 'N/A')

        html = build_payment_alert_html(student_name, amount, due_date)
        subject = f"Alerte Paiement - {student_name} - Umurerwa Magic School"

        try:
            result = send_html_email(to=to, subject=subject, html=html)
            return JsonResponse({'ok': True, 'sent_to': to, **result})
        except Exception as err:
            return JsonResponse({'error': str(err)}, status=502)
