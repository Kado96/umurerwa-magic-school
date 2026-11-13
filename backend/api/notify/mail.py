"""
Service email Umurerwa Magic School.
Pattern: relais Google Apps Script en priorité (SMTP Render Free souvent bloqué).
Inspiré de BurunduFoodPrice/backend/src/mail.js
"""
import os
import json
import urllib.request
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


def get_mail_config():
    return {
        'user': os.environ.get('GMAIL_USER', '').strip(),
        'password': os.environ.get('GMAIL_APP_PASSWORD', '').strip(),
        'host': os.environ.get('SMTP_HOST', 'smtp.gmail.com').strip(),
        'port': int(os.environ.get('SMTP_PORT', '465')),
        'secure': os.environ.get('SMTP_SECURE', 'true').lower() != 'false',
        'relay_url': os.environ.get('SCHOOL_GMAIL_RELAY_URL', '').strip(),
        'relay_secret': (os.environ.get('SCHOOL_GMAIL_RELAY_SECRET') or os.environ.get('NOTIFY_SECRET', '')).strip(),
    }


def send_via_relay(to, subject, html, from_name='Umurerwa Magic School'):
    cfg = get_mail_config()
    if not cfg['relay_url']:
        raise ValueError('SCHOOL_GMAIL_RELAY_URL manquant')
    if not cfg['relay_secret']:
        raise ValueError('SCHOOL_GMAIL_RELAY_SECRET / NOTIFY_SECRET manquant')

    payload = json.dumps({
        'secret': cfg['relay_secret'],
        'to': to or cfg['user'],
        'subject': subject or '(sans sujet)',
        'html': html or '<p>(vide)</p>',
        'fromName': from_name,
    }).encode('utf-8')

    req = urllib.request.Request(
        cfg['relay_url'],
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    with urllib.request.urlopen(req, timeout=45) as response:
        body = response.read().decode('utf-8')
        try:
            result = json.loads(body)
        except Exception:
            result = {'ok': True}

        if result.get('ok') is False:
            raise RuntimeError(result.get('error', f'Relay erreur: {body[:200]}'))

        return {
            'messageId': f'relay:{id(result)}',
            'accepted': [to or cfg['user']],
            'rejected': [],
            'via': 'apps-script-relay',
            'relay': result,
        }


def send_via_smtp(to, subject, html, from_name='Umurerwa Magic School'):
    cfg = get_mail_config()
    if not cfg['password']:
        raise ValueError('GMAIL_APP_PASSWORD manquant dans .env')

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject or '(sans sujet)'
    msg['From'] = f'{from_name} <{cfg["user"]}>'
    msg['To'] = to or cfg['user']
    msg.attach(MIMEText(html or '<p>(vide)</p>', 'html'))

    with smtplib.SMTP_SSL(cfg['host'], cfg['port']) as smtp:
        smtp.login(cfg['user'], cfg['password'])
        smtp.sendmail(cfg['user'], [to or cfg['user']], msg.as_string())

    return {
        'messageId': f'smtp:{id(msg)}',
        'accepted': [to or cfg['user']],
        'rejected': [],
        'via': 'smtp',
    }


def send_html_email(to, subject, html, from_name='Umurerwa Magic School'):
    """
    Envoie un email HTML.
    Prod Render : relais Apps Script en priorité (SMTP souvent bloqué).
    Local : SMTP si pas de relais, sinon relais aussi.
    """
    cfg = get_mail_config()
    is_prod = os.environ.get('DEBUG', 'True').lower() == 'false'
    prefer_relay = bool(cfg['relay_url']) or is_prod

    if prefer_relay and cfg['relay_url']:
        try:
            return send_via_relay(to, subject, html, from_name)
        except Exception as relay_err:
            if not cfg['password']:
                raise relay_err
            print(f'[mail] relais échoué, fallback SMTP: {relay_err}')
            return send_via_smtp(to, subject, html, from_name)

    return send_via_smtp(to, subject, html, from_name)
