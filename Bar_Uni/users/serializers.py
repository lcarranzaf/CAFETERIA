from rest_framework import serializers
from .models import CustomUser
from orders.models import Order
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db.models import Sum
import re
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    is_staff = serializers.BooleanField(default=False, required=False)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'first_name', 'last_name', 'telefono', 'password', 'is_staff']
        extra_kwargs = {
            'username': {
                'error_messages': {
                    'unique': 'Este nombre de usuario ya está registrado.'
                }
            },
            'email': {
                'error_messages': {
                    'unique': 'Este correo ya está registrado.'
                }
            }
        }

    def validate_first_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("El nombre solo debe contener letras.")
        return value

    def validate_last_name(self, value):
        if not value.isalpha():
            raise serializers.ValidationError("El apellido solo debe contener letras.")
        return value

    def validate_telefono(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("El número de teléfono debe contener solo dígitos.")
        if len(value) != 10:
            raise serializers.ValidationError("El número de teléfono debe tener exactamente 10 dígitos.")
        return value

    def validate_email(self, value):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("Correo electrónico no válido.")
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        is_staff = validated_data.pop('is_staff', False)

        if not request or not request.user.is_staff:
            is_staff = False

        validated_data['is_staff'] = is_staff
        return CustomUser.objects.create_user(**validated_data)
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'telefono', 'is_staff']
        read_only_fields = ['username', 'email', 'is_staff']


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

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
        
class CustomUserSerializer(serializers.ModelSerializer):
    pedidos = serializers.SerializerMethodField()
    total_gastado = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = [
            'id', 'username', 'first_name', 'last_name',
            'email', 'telefono', 'estrellas', 'is_staff',
            'pedidos', 'total_gastado'
        ]

    def get_pedidos(self, obj):
        return Order.objects.filter(usuario=obj, estado_pago='verificado').count()

    def get_total_gastado(self, obj):
        total = Order.objects.filter(usuario=obj, estado_pago='verificado').aggregate(
            total=Sum('total')
        )['total'] or 0
        return round(total, 2)