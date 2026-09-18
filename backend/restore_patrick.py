import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agashop.settings')
django.setup()

from django.contrib.auth.models import User, Group

username = 'Patrick'

try:
    user = User.objects.get(username__iexact=username)
    print(f"Restoring user: {user.username}")
    
    # Restore staff status
    user.is_staff = True
    user.save()
    
    # Restore agent group
    agent_group, _ = Group.objects.get_or_create(name='agent')
    user.groups.add(agent_group)
    
    print(f"✅ User {user.username} restored as Agent.")
    print(f"New Status - Is staff: {user.is_staff}, Groups: {[g.name for g in user.groups.all()]}")
    
except User.DoesNotExist:
    print(f"User '{username}' not found.")
except Exception as e:
    print(f"Error: {e}")
