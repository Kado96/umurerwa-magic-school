from django.http import JsonResponse
from django.views import View
from datetime import datetime


class HealthView(View):
    def get(self, request):
        return JsonResponse({
            'ok': True,
            'service': 'Umurerwa Magic School API',
            'time': datetime.utcnow().isoformat() + 'Z',
        })
