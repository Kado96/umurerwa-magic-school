from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

admin.site.site_header = 'UMURERWA MAGIC SCHOOL ADMINISTRATION'
admin.site.index_title = 'Administration Scolaire'
admin.site.site_title = 'Umurerwa Admin'

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/accounts/', include("api.accounts.urls")),
    path('api/school/', include("api.school.urls")),
    path('api/core/', include("api.core.urls")),
    path('api-auth/', include('rest_framework.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
