"""
API endpoints de notification email Umurerwa Magic School.
POST /api/notify/email → envoie un email HTML sécurisé par X-Notify-Secret
GET  /api/notify/health → statut de la config email
Inspiré de BurunduFoodPrice/backend/src/routes/notify.js
"""
import os
import json
from django.http import JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from .mail import send_html_email, get_mail_config


def authorize_request(request):
    """Vérifie le secret de notification (header ou body)."""
    expected = (os.environ.get('NOTIFY_SECRET') or '').strip()
    if not expected:
        return False
    header_secret = request.headers.get('X-Notify-Secret', '')
    query_secret = request.GET.get('secret', '')
    try:
        body = json.loads(request.body or '{}')
        body_secret = body.get('secret', '')
    except Exception:
        body_secret = ''

    return header_secret == expected or query_secret == expected or body_secret == expected


@method_decorator(csrf_exempt, name='dispatch')
class NotifyEmailView(View):
    """
    POST /api/notify/email
    Body: { to?, subject, html, secret? }
    Header: X-Notify-Secret

    Utilisé par les rapports automatiques ou n8n pour envoyer des emails.
    """

    def post(self, request):
        if not authorize_request(request):
            return JsonResponse({'error': 'Secret notify invalide'}, status=401)

        try:
            body = json.loads(request.body or '{}')
        except Exception:
            return JsonResponse({'error': 'Body JSON invalide'}, status=400)

        to = body.get('to')
        subject = body.get('subject')
        html = body.get('html')

        if not subject or not html:
            return JsonResponse({'error': 'subject et html requis'}, status=400)

        try:
            result = send_html_email(to=to, subject=subject, html=html)
            cfg = get_mail_config()
            return JsonResponse({'ok': True, **result, 'from': cfg['user']})
        except Exception as err:
            print(f'[notify/email] {err}')
            return JsonResponse({
                'error': str(err),
                'hint': 'Si tu es sur Render Free, SMTP est bloqué. Utilise le relais Google Apps Script (HTTP).',
            }, status=502)


@method_decorator(csrf_exempt, name='dispatch')
class NotifyHealthView(View):
    """GET /api/notify/health → statut de la config email"""

    def get(self, request):
        cfg = get_mail_config()
        return JsonResponse({
            'ok': True,
            'user': cfg['user'],
            'host': cfg['host'],
            'port': cfg['port'],
            'passwordConfigured': bool(cfg['password']),
            'relayConfigured': bool(cfg['relay_url'] and cfg['relay_secret']),
            'preferredTransport': 'apps-script-relay' if cfg['relay_url'] else 'smtp',
        })
