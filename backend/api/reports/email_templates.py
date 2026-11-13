"""
Templates HTML pour les rapports email de l'école Umurerwa.
"""
from datetime import datetime


def get_report_header(title: str, subtitle: str = '') -> str:
    return f"""
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-family: Arial, sans-serif;">&#x1F3EB; Umurerwa Magic School</h1>
        <h2 style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px; font-family: Arial, sans-serif;">{title}</h2>
        {f'<p style="color: rgba(255,255,255,0.8); margin: 4px 0 0; font-size: 14px;">{subtitle}</p>' if subtitle else ''}
    </div>
    """


def get_report_footer() -> str:
    year = datetime.now().year
    return f"""
    <div style="background: #f8f9fa; padding: 20px; border-radius: 0 0 12px 12px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="color: #6c757d; font-size: 12px; margin: 0; font-family: Arial, sans-serif;">
            &copy; {year} Umurerwa Magic School &mdash; Rapport g&eacute;n&eacute;r&eacute; automatiquement<br>
            Pour toute question, contactez l&rsquo;administration.
        </p>
    </div>
    """


def build_weekly_summary_html(stats: dict) -> str:
    """Génère le HTML du rapport hebdomadaire."""
    header = get_report_header("Rapport Hebdomadaire", f"Semaine du {stats.get('week_start', 'N/A')}")
    footer = get_report_footer()

    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 20px; background: #f0f2f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            {header}
            <div style="padding: 30px;">
                <h3 style="color: #333; margin-top: 0;">&#x1F4CA; R&eacute;sum&eacute; de la semaine</h3>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;">&#x1F469;&#x200D;&#x1F393; &Eacute;l&egrave;ves actifs</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right; font-size: 18px; font-weight: bold; color: #667eea;">{stats.get('total_students', 0)}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;">&#x1F4DA; Cours dispens&eacute;s</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right; font-size: 18px; font-weight: bold; color: #28a745;">{stats.get('total_courses', 0)}</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;">&#x1F4B0; Paiements re&ccedil;us</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right; font-size: 18px; font-weight: bold; color: #28a745;">{stats.get('payments_received', 0)} BIF</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;">&#x26A0;&#xFE0F; Paiements en attente</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right; font-size: 18px; font-weight: bold; color: #dc3545;">{stats.get('payments_pending', 0)} BIF</td>
                    </tr>
                    <tr style="background: #f8f9fa;">
                        <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #495057;">&#x1F468;&#x200D;&#x1F3EB; Enseignants actifs</td>
                        <td style="padding: 12px; border: 1px solid #dee2e6; text-align: right; font-size: 18px; font-weight: bold; color: #667eea;">{stats.get('total_teachers', 0)}</td>
                    </tr>
                </table>

                {f'<div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 15px; margin-top: 20px;"><h4 style="color: #856404; margin: 0 0 8px;">&#x26A0;&#xFE0F; Points d attention</h4><p style="color: #856404; margin: 0;">{stats.get("alerts", "")}</p></div>' if stats.get("alerts") else ''}

                <p style="color: #6c757d; font-size: 13px; margin-top: 20px; border-top: 1px solid #e9ecef; padding-top: 15px;">
                    &#x1F4C5; G&eacute;n&eacute;r&eacute; le {datetime.now().strftime('%d/%m/%Y &agrave; %H:%M')} (heure de Bujumbura)
                </p>
            </div>
            {footer}
        </div>
    </body>
    </html>
    """


def build_payment_alert_html(student_name: str, amount: int, due_date: str) -> str:
    """Email d'alerte paiement en retard."""
    header = get_report_header("&#x26A0;&#xFE0F; Alerte Paiement", "Rappel de paiement en attente")
    footer = get_report_footer()

    return f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 20px; background: #f0f2f5; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            {header}
            <div style="padding: 30px;">
                <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                    <h3 style="color: #856404; margin: 0 0 10px;">Rappel de Paiement</h3>
                    <p style="color: #856404; margin: 0;">
                        L&rsquo;&eacute;l&egrave;ve <strong>{student_name}</strong> a un paiement de <strong>{amount:,} BIF</strong> en attente depuis le {due_date}.
                    </p>
                </div>
                <p style="color: #333;">Veuillez prendre les mesures n&eacute;cessaires pour r&eacute;gulariser la situation.</p>
            </div>
            {footer}
        </div>
    </body>
    </html>
    """
