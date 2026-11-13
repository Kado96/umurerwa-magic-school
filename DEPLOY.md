# 🚀 Guide de Déploiement — Umurerwa Magic School

> Pattern inspiré de **BurunduFoodPrice** : Render (Django) + Vercel (React/Vite) + Supabase (PostgreSQL)

---

## Architecture

```
┌─────────────────────┐     HTTPS      ┌─────────────────────────┐
│   Vercel (Frontend) │ ◄────────────► │  Render (Backend Django) │
│   React + Vite      │                │  gunicorn + WhiteNoise   │
│   vercel.json       │                │  render.yaml             │
└─────────────────────┘                └────────────┬────────────┘
                                                     │ DATABASE_URL
                                                     ▼
                                       ┌─────────────────────────┐
                                       │   Supabase (PostgreSQL)  │
                                       │   bctmbucpbyfbsliporlx  │
                                       └─────────────────────────┘
                                                     │
                                       ┌─────────────────────────┐
                                       │  Gmail via Apps Script   │
                                       │  (relais HTTP — SMTP     │
                                       │   bloqué sur Render Free)│
                                       └─────────────────────────┘
```

---

## 1. Prérequis

- Compte [Render](https://render.com) (Free tier OK)
- Compte [Vercel](https://vercel.com) (Free tier OK)
- Projet Supabase : `bctmbucpbyfbsliporlx`
- Gmail avec [App Password](https://myaccount.google.com/apppasswords) activé
- Google Apps Script déployé comme webapp (relais email)

---

## 2. Déploiement Backend (Render)

### 2.1 Créer le Web Service

1. Dashboard Render → **New** → **Web Service**
2. Connecter ton repo GitHub
3. **Root Directory** : `backend`
4. **Runtime** : Python
5. **Build Command** :
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput && python manage.py migrate
   ```
6. **Start Command** :
   ```bash
   gunicorn umurerwa.wsgi:application --bind 0.0.0.0:$PORT
   ```

### 2.2 Variables d'environnement (Render Dashboard → Environment)

| Variable | Valeur |
|---|---|
| `DEBUG` | `False` |
| `SECRET_KEY` | Générer avec `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"` |
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@db.bctmbucpbyfbsliporlx.supabase.co:5432/postgres` |
| `ALLOWED_HOSTS` | `umurerwa-api.onrender.com,localhost` |
| `CORS_ORIGIN` | `https://umurerwa-magic-school.vercel.app,http://localhost:8080,capacitor://localhost` |
| `SUPABASE_URL` | `https://bctmbucpbyfbsliporlx.supabase.co` |
| `SUPABASE_ANON_KEY` | *(depuis Supabase Dashboard → Settings → API)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(depuis Supabase Dashboard → Settings → API — secret!)* |
| `GMAIL_USER` | `ton-email@gmail.com` |
| `GMAIL_APP_PASSWORD` | `xxxx xxxx xxxx xxxx` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `NOTIFY_SECRET` | `umurerwa-notify-2026` *(ou valeur custom sécurisée)* |
| `SCHOOL_GMAIL_RELAY_URL` | URL de ton Google Apps Script |
| `SCHOOL_GMAIL_RELAY_SECRET` | Même valeur que `NOTIFY_SECRET` |

### 2.3 Vérifier le déploiement

```bash
curl https://umurerwa-api.onrender.com/health/
# → {"ok": true, "service": "Umurerwa Magic School API", "time": "..."}

curl https://umurerwa-api.onrender.com/api/notify/health/
# → {"ok": true, "user": "...", "relayConfigured": true, ...}
```

---

## 3. Déploiement Frontend (Vercel)

### 3.1 Importer le projet

1. Dashboard Vercel → **Add New** → **Project**
2. Connecter le repo GitHub
3. **Root Directory** : `frontend`
4. **Framework Preset** : Vite
5. **Build Command** : `npm run build`
6. **Output Directory** : `dist`

### 3.2 Variables d'environnement (Vercel Dashboard → Settings → Environment Variables)

| Variable | Valeur |
|---|---|
| `VITE_SUPABASE_PROJECT_ID` | `bctmbucpbyfbsliporlx` |
| `VITE_SUPABASE_URL` | `https://bctmbucpbyfbsliporlx.supabase.co` |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` *(clé anon publique)* |
| `VITE_API_URL` | `https://umurerwa-api.onrender.com/api` |

### 3.3 Vérifier le déploiement

Ouvrir `https://umurerwa-magic-school.vercel.app` — l'application doit charger sans erreur CORS.

---

## 4. Configuration Supabase

### 4.1 Connexion PostgreSQL directe (pour Django)

Depuis **Supabase Dashboard → Settings → Database** :
- Host : `db.bctmbucpbyfbsliporlx.supabase.co`
- Port : `5432`
- Database : `postgres`
- User : `postgres`
- Password : *(ton mot de passe Supabase)*

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.bctmbucpbyfbsliporlx.supabase.co:5432/postgres
```

### 4.2 Row Level Security (RLS)

Vérifie que les tables ont le RLS configuré selon les migrations dans `supabase/`.

---

## 5. Email — Relais Google Apps Script

> ⚠️ Sur Render Free, le port SMTP sortant est souvent bloqué. Le relais Apps Script contourne ce problème via HTTP.

### 5.1 Créer le Google Apps Script

1. Aller sur [script.google.com](https://script.google.com)
2. Nouveau projet → coller ce code :

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const SECRET = 'umurerwa-notify-2026'; // Même que NOTIFY_SECRET
    
    if (data.secret !== SECRET) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    GmailApp.sendEmail(data.to, data.subject, '', {
      htmlBody: data.html,
      name: data.fromName || 'Umurerwa Magic School',
    });
    
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. **Déployer** → Nouvelle déploiement → Type : **Application web**
   - Exécuter en tant que : **Moi**
   - Accès : **Tout le monde**
4. Copier l'URL et la mettre dans `SCHOOL_GMAIL_RELAY_URL`

### 5.2 Tester l'envoi d'email

```bash
curl -X POST https://umurerwa-api.onrender.com/api/notify/email/ \
  -H "Content-Type: application/json" \
  -H "X-Notify-Secret: umurerwa-notify-2026" \
  -d '{"to": "admin@exemple.com", "subject": "Test", "html": "<p>Test email Umurerwa</p>"}'
```

---

## 6. Keep-Alive (cron-job.org)

Le GitHub Actions keep-alive est **désactivé** pour économiser les minutes CI.

Utilise plutôt **[cron-job.org](https://cron-job.org)** (gratuit) :

1. Créer un compte sur cron-job.org
2. **New Cronjob** :
   - URL : `https://umurerwa-api.onrender.com/health/`
   - Schedule : toutes les **14 minutes**
   - Method : GET
3. Activer le cronjob

---

## 7. Routes API disponibles

| Méthode | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/health/` | Health check Render | Public |
| `GET` | `/api/notify/health/` | Statut config email | Public |
| `POST` | `/api/notify/email/` | Envoyer un email HTML | `X-Notify-Secret` |
| `POST` | `/api/reports/send-weekly/` | Rapport hebdomadaire | `X-Notify-Secret` |
| `POST` | `/api/reports/send-payment-alert/` | Alerte paiement | `X-Notify-Secret` |
| `*` | `/api/accounts/` | Authentification JWT | — |
| `*` | `/api/school/` | Données scolaires | JWT |
| `*` | `/api/core/` | Core métier | JWT |
| `*` | `/admin/` | Django Admin | Session |

---

## 8. Développement local

```bash
# Backend
cd backend
cp .env.example .env
# Remplir les valeurs dans .env
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd frontend
cp .env.example .env
# Modifier VITE_API_URL=http://localhost:8000/api
npm install
npm run dev
```

---

## 9. Checklist de mise en production

- [ ] `SECRET_KEY` Django généré et configuré sur Render
- [ ] `DATABASE_URL` Supabase PostgreSQL configuré
- [ ] `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` configurés
- [ ] `GMAIL_USER` + `GMAIL_APP_PASSWORD` configurés
- [ ] Google Apps Script déployé et URL configurée dans `SCHOOL_GMAIL_RELAY_URL`
- [ ] `NOTIFY_SECRET` configuré (même valeur backend et Apps Script)
- [ ] Variables Vercel configurées
- [ ] `CORS_ORIGIN` inclut l'URL Vercel finale
- [ ] `ALLOWED_HOSTS` inclut le domaine Render final
- [ ] Health check répond : `GET /health/`
- [ ] Test email envoyé avec succès
- [ ] cron-job.org configuré pour le keep-alive

---

*Guide généré automatiquement — Umurerwa Magic School — 2026*
