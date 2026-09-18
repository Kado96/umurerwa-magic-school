# 🔄 Guide de Remplacement de la Base de Données

## ✅ Modèles Créés

Tous les nouveaux modèles ont été ajoutés avec succès :

### Dans `api/accounts/models.py` :
- ✅ **Role** - Rôles utilisateurs (Admin, Gérant, Vendeur, etc.)
- ✅ **Subscription** - Abonnements (FREE, BASIC, PREMIUM, ENTERPRISE)
- ✅ **Notification** - Notifications pour les utilisateurs

### Dans `api/shops/models.py` :
- ✅ **Expense** - Dépenses des boutiques
- ✅ **Commission** - Commissions sur les ventes

## ⚠️ Problème Actuel

La base de données `db.sqlite3` est verrouillée par un processus. Pour la remplacer :

## 📋 Solution : Remplacement Manuel

### Étape 1 : Fermer tous les programmes

1. **Arrêter le serveur Django** (si en cours d'exécution) :
   ```powershell
   Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force
   ```

2. **Fermer** :
   - VS Code / Cursor (si ouvert sur ce dossier)
   - Explorateur de fichiers Windows
   - Tout autre programme utilisant `db.sqlite3`

### Étape 2 : Supprimer/Renommer les anciens fichiers

```powershell
cd E:\AgaShop\Frontend\api\backend

# Renommer les anciens fichiers
Rename-Item -Path "db.sqlite3" -NewName "db.sqlite3.old" -ErrorAction SilentlyContinue
Rename-Item -Path "db.sqlite3-journal" -NewName "db.sqlite3-journal.old" -ErrorAction SilentlyContinue
Remove-Item -Path "db.sqlite3.backup_*" -Force -ErrorAction SilentlyContinue
```

### Étape 3 : Créer les migrations et la nouvelle base

```powershell
# Activer l'environnement virtuel
..\virtualenv\api\Scripts\Activate.ps1

# Créer les migrations pour les nouveaux modèles
python manage.py makemigrations accounts
python manage.py makemigrations shops

# Appliquer toutes les migrations (créera la nouvelle base)
python manage.py migrate
```

### Étape 4 : Vérifier

```powershell
# Vérifier que la base existe
if (Test-Path "db.sqlite3") {
    Write-Host "✓ Base de donnees creee avec succes!"
    
    # Lister les tables
    python -c "import sqlite3; conn = sqlite3.connect('db.sqlite3'); cursor = conn.cursor(); cursor.execute('SELECT name FROM sqlite_master WHERE type=\"table\" ORDER BY name'); [print(f'  - {t[0]}') for t in cursor.fetchall()]; conn.close()"
}
```

## 🎯 Résultat Attendu

Après ces étapes, vous devriez avoir :

### Tables Django de base :
- `django_migrations`
- `django_content_type`
- `auth_user`, `auth_group`, etc.
- `authtoken_token`

### Tables Accounts :
- `api_account` (avec nouveau champ `role_id`)
- ✅ **`api_role`** (NOUVEAU)
- ✅ **`api_subscription`** (NOUVEAU)
- ✅ **`api_notification`** (NOUVEAU)

### Tables Shops :
- `api_shop`
- `api_product`
- `api_sales`
- `api_supply`
- etc.
- ✅ **`api_expense`** (NOUVEAU)
- ✅ **`api_commission`** (NOUVEAU)

## 🚀 Après le Remplacement

Une fois la base créée, vous pouvez démarrer le serveur :

```powershell
python manage.py runserver
```

## 📝 Notes

- Les anciens fichiers sont sauvegardés avec `.old` - vous pouvez les supprimer une fois que tout fonctionne
- Si vous avez des données importantes dans l'ancienne base, vous devrez les migrer manuellement
- Les nouveaux modèles sont prêts à être utilisés dans votre API REST
