from django.apps import AppConfig

class SchoolConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api.school'

    def ready(self):
        import api.school.signals
