import uuid
import os
from django.db import models

class GlobalContent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=100, unique=True, help_text="Ex: 'hero.title'")
    value_fr = models.TextField(verbose_name="Valeur (Français)")
    description = models.TextField(blank=True, null=True, help_text="Contexte d'utilisation")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.key} : {self.value_fr[:50]}..."

    class Meta:
        verbose_name = "Contenu Global"
        verbose_name_plural = "Contenus Globaux"

def get_media_upload_path(instance, filename):
    # Organise les fichiers par ID et nettoie le nom
    ext = filename.split('.')[-1]
    filename = f"{instance.technical_name}.{ext}" if instance.technical_name else filename
    return os.path.join('assets', str(instance.id), filename)

class MediaAsset(models.Model):
    MEDIA_TYPES = (
        ('IMAGE', 'Image'),
        ('VIDEO', 'Vidéo'),
        ('DOCUMENT', 'Document'),
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    technical_name = models.SlugField(max_length=100, unique=True, help_text="Nom utilisé dans le code (ex: logo-nav)")
    file = models.FileField(upload_to=get_media_upload_path)
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='IMAGE')
    alt_text = models.CharField(max_length=255, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"[{self.media_type}] {self.technical_name}"

    class Meta:
        verbose_name = "Média"
        verbose_name_plural = "Médias"
