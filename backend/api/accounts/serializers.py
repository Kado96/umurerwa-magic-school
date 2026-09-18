from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import Notification

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    role = serializers.SerializerMethodField(read_only=True)
    role_input = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'role', 'role_input']

    def get_role(self, obj):
        try:
            return obj.profile.role
        except:
            return "PARENT"

    def create(self, validated_data):
        role = validated_data.pop('role_input', 'PARENT')
        user = User.objects.create_user(**validated_data)
        
        from .models import Profile
        profile, created = Profile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()

        # Création des profils métier
        if role == 'TEACHER':
            from api.school.models import Teacher
            Teacher.objects.get_or_create(user=user)
        elif role == 'PARENT':
            from api.school.models import Parent
            Parent.objects.get_or_create(user=user)
            
        return user

    def update(self, instance, validated_data):
        role = validated_data.pop('role_input', None)
        if role:
            from .models import Profile
            profile, created = Profile.objects.get_or_create(user=instance)
            profile.role = role
            profile.save()

            if role == 'TEACHER':
                from api.school.models import Teacher
                Teacher.objects.get_or_create(user=instance)
            elif role == 'PARENT':
                from api.school.models import Parent
                Parent.objects.get_or_create(user=instance)
        
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        
        return super().update(instance, validated_data)

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        
        # Auto-create or get profile
        from .models import Profile
        
        # Détection intelligente du rôle si nécessaire
        if user.is_superuser or user.is_staff:
            role = 'ADMIN'
        elif hasattr(user, 'teacher_profile'):
            role = 'TEACHER'
        else:
            role = 'PARENT'
            
        profile, created = Profile.objects.get_or_create(user=user, defaults={'role': role})
        
        if not created:
            # S'assurer que le rôle est cohérent avec le statut de l'utilisateur
            if user.is_superuser and profile.role != 'ADMIN':
                profile.role = 'ADMIN'
                profile.save()
            elif hasattr(user, 'teacher_profile') and profile.role == 'PARENT':
                profile.role = 'TEACHER'
                profile.save()
        
        token['role'] = profile.role
        return token

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'title', 'message', 'notification_type', 'is_read', 'created_at']
