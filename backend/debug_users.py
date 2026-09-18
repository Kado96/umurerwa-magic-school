import os
import django
import sys

# Ajouter le chemin du projet au sys.path
sys.path.append(r'e:\AgaShop\Frontend\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agashop.settings')
django.setup()

from django.contrib.auth.models import User

def check_users():
    email_to_check = "maecoginfa@gmail.com"
    print(f"Checking for users with email: {email_to_check}")
    
    users = User.objects.filter(email__iexact=email_to_check)
    print(f"Found {users.count()} users:")
    for u in users:
        print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}")
        
    all_users = User.objects.all().order_by('id')
    print("\nAll users:")
    for u in all_users:
        print(f"ID: {u.id}, Username: {u.username}, Email: {u.email}")

if __name__ == "__main__":
    check_users()
