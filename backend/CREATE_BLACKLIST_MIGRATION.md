# Instructions pour créer les migrations de blacklist

Après avoir ajouté `rest_framework_simplejwt.token_blacklist` dans INSTALLED_APPS,
tu dois créer les migrations pour les tables de blacklist :

```bash
cd api/backend
python manage.py makemigrations token_blacklist
python manage.py migrate token_blacklist
```

Cela créera les tables nécessaires pour stocker les tokens blacklistés.
