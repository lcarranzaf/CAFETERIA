from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# 👤 Serializer para el registro de usuarios
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(default=False, required=False) 

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'telefono', 'password', 'is_staff']

    def create(self, validated_data):
        request = self.context.get('request')
        is_staff = validated_data.pop('is_staff', False)

        if not request or not request.user.is_staff:
            is_staff = False 

        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            telefono=validated_data['telefono'],
            password=validated_data['password']
        )
        user.is_staff = is_staff
        user.save()
        return user
# Serializer para obtener perfil del usuario autenticado (incluye is_staff)
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'telefono', 'is_staff']
        read_only_fields = ['username', 'email', 'is_staff']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Campos personalizados incluidos en el token JWT
        token['username'] = user.username
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['email'] = user.email
        token['telefono'] = user.telefono
        token['is_staff'] = user.is_staff

        return token

class UsuarioSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'first_name', 'last_name']