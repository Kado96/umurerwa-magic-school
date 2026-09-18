import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agashop.settings')
django.setup()

from django.contrib.auth.models import User
from django.contrib.auth import authenticate

username = 'Patrick'
password = '1111'

try:
    user = User.objects.get(username__iexact=username)
    print(f"User found: {user.username}")
    print(f"Email: {user.email}")
    print(f"Is active: {user.is_active}")
    print(f"Is staff: {user.is_staff}")
    print(f"Is superuser: {user.is_superuser}")
    print(f"Groups: {[g.name for g in user.groups.all()]}")
    
    # Test authentication
    auth_user = authenticate(username=user.username, password=password)
    if auth_user:
        print("✅ Authentication successful with password '1111'")
    else:
        print("❌ Authentication failed with password '1111'")
        
except User.DoesNotExist:
    print(f"User '{username}' not found.")
    # Check if there is an email match
    user_by_email = User.objects.filter(email__iexact=username).first()
    if user_by_email:
        print(f"Found user by email: {user_by_email.username}")
except Exception as e:
    print(f"Error: {e}")
