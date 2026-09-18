# 📘 Guide d'utilisation de l'Admin Django

## 🚀 Accès à l'Admin Django

1. **Démarrer le serveur Django** (si ce n'est pas déjà fait) :
   ```powershell
   cd E:\AgaShop\Frontend\api
   .\virtualenv\api\Scripts\Activate.ps1
   cd backend
   python manage.py runserver
   ```

2. **Accéder à l'interface admin** :
   - Ouvrir votre navigateur
   - Aller sur : **http://localhost:8000/admin/**
   - Se connecter avec vos identifiants de superutilisateur

## 👤 Créer un Superutilisateur (si nécessaire)

Si vous n'avez pas encore de compte admin :
```powershell
cd E:\AgaShop\Frontend\api\backend
..\virtualenv\api\Scripts\Activate.ps1
python manage.py createsuperuser
```

## 📦 Créer des Produits (BasicProduct)

### Étapes :

1. **Accéder à la section Basic Products** :
   - Dans l'admin Django, cliquez sur **"Basic Products"** dans la section **"SHOPS"**

2. **Ajouter un nouveau produit** :
   - Cliquez sur **"Add Basic Product"** (en haut à droite)
   - Remplir les champs :
     - **Name** : Nom du produit (ex: "Riz", "Haricots", etc.)
     - **Sub category** : Sélectionner une sous-catégorie existante
     - **Image** : Télécharger une image du produit (optionnel)
   - Cliquer sur **"Save"**

3. **Créer des catégories et sous-catégories** (si nécessaire) :
   - **Categories** : Créer d'abord une catégorie (ex: "Alimentaire", "Boissons")
   - **Sub Categories** : Créer ensuite une sous-catégorie liée à cette catégorie

## 👥 Créer des Agents

### Étapes :

1. **Créer un utilisateur (User)** :
   - Dans l'admin Django, cliquez sur **"Users"** dans la section **"AUTHENTICATION AND AUTHORIZATION"**
   - Cliquez sur **"Add User"**
   - Remplir :
     - **Username** : Nom d'utilisateur unique
     - **Password** : Mot de passe (sera crypté automatiquement)
     - **Password confirmation** : Confirmer le mot de passe
   - Cliquer sur **"Save"**

2. **Ajouter des informations supplémentaires au User** :
   - Après avoir créé le User, vous serez redirigé vers la page de modification
   - Remplir les champs optionnels :
     - **First name** : Prénom
     - **Last name** : Nom
     - **Email address** : Adresse email
   - **Important** : Cocher **"Staff status"** si l'utilisateur doit avoir accès à l'admin
   - **Important** : Cocher **"Superuser status"** pour donner tous les droits
   - Cliquer sur **"Save"**

3. **Créer un Account associé** :
   - Cliquer sur **"Accounts"** dans la section **"ACCOUNTS"**
   - Cliquer sur **"Add Account"**
   - Remplir :
     - **User** : Sélectionner l'utilisateur créé précédemment
     - **Role** : Sélectionner un rôle (si vous avez créé des rôles personnalisés)
     - **Phone number** : Numéro de téléphone (optionnel)
     - **Is active** : Cocher pour activer le compte
   - Cliquer sur **"Save"**

4. **Ajouter l'utilisateur à un groupe (pour les agents)** :
   - Retourner dans **"Users"**
   - Sélectionner l'utilisateur créé
   - Dans la section **"Permissions"**, chercher **"Groups"**
   - Ajouter l'utilisateur au groupe **"agent"** ou **"admin"** selon le besoin
   - Cliquer sur **"Save"**

## 🔧 Actions Utiles dans l'Admin

### Pour les Accounts :

- **Réinitialiser le mot de passe** :
  1. Sélectionner un ou plusieurs comptes dans la liste
  2. Choisir l'action **"Réinitialiser le mot de passe (blackliste les tokens)"**
  3. Cliquer sur **"Go"**
  4. Un nouveau mot de passe sera généré et envoyé par email

### Pour les Users :

- **Changer le mot de passe** :
  1. Sélectionner un utilisateur dans la liste
  2. Choisir l'action **"Changer le mot de passe (invalide les tokens JWT)"**
  3. Cliquer sur **"Go"**
  4. Vous serez redirigé vers le formulaire de changement de mot de passe

## 📝 Notes Importantes

- **BasicProduct** : Ce sont les produits du catalogue central. Ils peuvent être ajoutés à différentes boutiques (Shop) via l'interface mobile.
- **Product** : Ce sont les produits associés à une boutique spécifique avec des informations comme la quantité, le prix, etc.
- **Account** : Représente le profil utilisateur lié à un User Django.
- **Role** : Vous pouvez créer des rôles personnalisés dans la section **"Roles"** pour gérer les permissions.

## 🔐 Sécurité

- Lors du changement de mot de passe, tous les tokens JWT de l'utilisateur sont automatiquement blacklistés
- Les anciens tokens ne peuvent plus être utilisés après un changement de mot de passe

## 🌐 URLs Utiles

- **Admin Django** : http://localhost:8000/admin/
- **API Root** : http://localhost:8000/api/
- **Login API** : http://localhost:8000/api/login/
- **Logout API** : http://localhost:8000/api/logout/
