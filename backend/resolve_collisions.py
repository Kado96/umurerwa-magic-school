import os
import django
import sys

# Configuration de l'environnement Django
sys.path.append(r'e:\AgaShop\Frontend\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agashop.settings')
django.setup()

from django.contrib.auth.models import User

def resolve_collisions():
    # Liste des IDs à traiter (les "doublons" à renommer)
    conflicts = [
        {'id': 12, 'new_email': 'maecoginfa_dup@gmail.com'},
        {'id': 7,  'new_email': 'kandekedonald_dup@gmail.com'}
    ]
    
    print("Démarrage de la résolution des collisions...")
    
    for conflict in conflicts:
        try:
            user = User.objects.get(id=conflict['id'])
            old_email = user.email
            user.email = conflict['new_email']
            # On change aussi le username s'il est identique à l'email pour éviter d'autres conflits d'unicité potentiels
            if user.username == old_email:
                user.username = conflict['new_email']
            
            user.save()
            print(f"✅ Utilisateur ID {conflict['id']} mis à jour : {old_email} -> {conflict['new_email']}")
        except User.DoesNotExist:
            print(f"⚠️ Utilisateur ID {conflict['id']} non trouvé.")
        except Exception as e:
            print(f"❌ Erreur pour ID {conflict['id']} : {str(e)}")

    print("\nVérification finale :")
    for u in User.objects.filter(id__in=[3, 12, 7, 9]):
        print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}")

if __name__ == "__main__":
    resolve_collisions()
