# 📋 Instructions Finales - Remplacement de la Base de Données

## ✅ Ce qui a été fait

1. ✅ **Tous les nouveaux modèles ont été créés** :
   - `Role`, `Subscription`, `Notification` (dans `api/accounts/models.py`)
   - `Expense`, `Commission` (dans `api/shops/models.py`)

2. ✅ **Nouvelle base de données créée** : `db_new.sqlite3` (12288 octets)

## ⚠️ Situation Actuelle

Les fichiers sont **verrouillés** par un processus. Vous devez faire le remplacement **manuellement**.

### Fichiers présents :
- ❌ `db.sqlite3` (491520 octets) - **ANCIENNE BASE** à supprimer
- ✅ `db_new.sqlite3` (12288 octets) - **NOUVELLE BASE** à utiliser
- ❌ `db.sqlite3-journal` (8720 octets) - Fichier journal à supprimer
- ❌ `db.sqlite3.backup_20260128_064707` (491520 octets) - Backup à supprimer

## 🔧 Solution : Remplacement Manuel

### Étape 1 : Fermer TOUS les programmes

**IMPORTANT** : Fermez absolument tous les programmes qui pourraient utiliser la base :

1. **Serveur Django** (si en cours d'exécution)
   - Appuyez sur `Ctrl+C` dans le terminal où il tourne
   - Ou fermez le terminal

2. **IDE/Éditeur** (VS Code, Cursor, PyCharm, etc.)
   - Fermez complètement l'application
   - Pas juste la fenêtre, fermez l'application entière

3. **Explorateur de fichiers Windows**
   - Fermez toutes les fenêtres ouvertes sur `E:\AgaShop\Frontend\api\backend\`

4. **Tout autre programme Python**
   - Vérifiez dans le Gestionnaire des tâches

### Étape 2 : Supprimer les anciens fichiers

Ouvrez un **nouveau** PowerShell (pas celui de votre IDE) :

```powershell
cd E:\AgaShop\Frontend\api\backend

# Supprimer l'ancienne base
Remove-Item "db.sqlite3" -Force

# Supprimer le fichier journal
Remove-Item "db.sqlite3-journal" -Force

# Supprimer le backup
Remove-Item "db.sqlite3.backup_*" -Force
```

### Étape 3 : Renommer la nouvelle base

```powershell
# Renommer db_new.sqlite3 en db.sqlite3
Rename-Item "db_new.sqlite3" "db.sqlite3" -Force

# Supprimer le journal de la nouvelle base
Remove-Item "db_new.sqlite3-journal" -Force
```

### Étape 4 : Vérifier

```powershell
# Vérifier qu'il ne reste que db.sqlite3
Get-ChildItem -Filter "db*.sqlite3*"

# Devrait afficher seulement : db.sqlite3 (12288 octets)
```

### Étape 5 : Créer et appliquer les migrations

```powershell
# Activer l'environnement virtuel
..\virtualenv\api\Scripts\Activate.ps1

# Créer les migrations pour les nouveaux modèles
python manage.py makemigrations accounts
python manage.py makemigrations shops

# Appliquer toutes les migrations
python manage.py migrate
```

### Étape 6 : Vérifier les tables créées

```powershell
python manage.py showmigrations
```

Vous devriez voir toutes les migrations appliquées, y compris celles pour les nouveaux modèles.

## 🎯 Résultat Attendu

Après ces étapes, vous aurez :

- ✅ Base de données propre : `db.sqlite3` (avec toutes les tables)
- ✅ Nouvelles tables créées :
  - `api_role`
  - `api_subscription`
  - `api_notification`
  - `api_expense`
  - `api_commission`

## 🚀 Démarrer le Serveur

Une fois tout terminé :

```powershell
python manage.py runserver
```

## ⚠️ Si ça ne fonctionne toujours pas

Si les fichiers sont toujours verrouillés après avoir fermé tous les programmes :

1. **Redémarrez votre ordinateur** (solution radicale mais efficace)
2. Ou utilisez un outil comme **Unlocker** ou **Process Explorer** pour identifier quel processus verrouille les fichiers
