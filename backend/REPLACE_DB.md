# 🔄 Remplacement de la Base de Données

## ✅ Nouvelle Base de Données Créée

Une nouvelle base de données a été créée avec succès : **`db_new.sqlite3`**

Cette nouvelle base contient :
- ✅ Toutes les tables existantes
- ✅ **Nouvelles tables ajoutées** :
  - `api_role` - Rôles utilisateurs
  - `api_subscription` - Abonnements
  - `api_notification` - Notifications
  - `api_expense` - Dépenses
  - `api_commission` - Commissions

## 📋 Étapes pour Remplacer l'Ancienne Base

### Option 1 : Via PowerShell (Recommandé)

```powershell
cd E:\AgaShop\Frontend\api\backend

# 1. Arrêter tous les serveurs Django
Get-Process | Where-Object {$_.ProcessName -like "*python*"} | Stop-Process -Force

# 2. Attendre quelques secondes
Start-Sleep -Seconds 3

# 3. Renommer l'ancienne base
Rename-Item -Path "db.sqlite3" -NewName "db.sqlite3.old_backup" -ErrorAction SilentlyContinue
Rename-Item -Path "db.sqlite3-journal" -NewName "db.sqlite3-journal.old_backup" -ErrorAction SilentlyContinue

# 4. Renommer la nouvelle base
Rename-Item -Path "db_new.sqlite3" -NewName "db.sqlite3"

# 5. Vérifier
if (Test-Path "db.sqlite3") {
    Write-Host "✓ Base de donnees remplacee avec succes!"
} else {
    Write-Host "✗ Erreur lors du remplacement"
}
```

### Option 2 : Manuellement

1. **Fermez tous les programmes** qui pourraient utiliser `db.sqlite3` :
   - Serveur Django (`python manage.py runserver`)
   - IDE (VS Code, PyCharm, etc.)
   - Explorateur de fichiers ouvert sur ce dossier

2. **Renommez les anciens fichiers** :
   - `db.sqlite3` → `db.sqlite3.old_backup`
   - `db.sqlite3-journal` → `db.sqlite3-journal.old_backup`

3. **Renommez la nouvelle base** :
   - `db_new.sqlite3` → `db.sqlite3`

4. **Vérifiez** que `db.sqlite3` existe et fonctionne

## 🚀 Après le Remplacement

Une fois la base remplacée, vous pouvez :

```powershell
# Démarrer le serveur Django
cd E:\AgaShop\Frontend\api\backend
..\virtualenv\api\Scripts\Activate.ps1
python manage.py runserver
```

## ⚠️ Note

Les anciens fichiers sont sauvegardés avec le suffixe `.old_backup`. Vous pouvez les supprimer une fois que vous avez vérifié que tout fonctionne correctement.
