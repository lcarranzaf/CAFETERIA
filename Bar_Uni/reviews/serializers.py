from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    es_del_usuario = serializers.SerializerMethodField()
    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = ['id', 'menu', 'comentario', 'calificacion', 'usuario_nombre', 'es_del_usuario']
        read_only_fields = ['usuario']

    def get_es_del_usuario(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.usuario == request.user
        return False

    def get_usuario_nombre(self, obj):
        nombre = f"{obj.usuario.first_name} {obj.usuario.last_name}".strip()
        return nombre if nombre else "Anónimo"

    def validate_calificacion(self, value):
        if value < 1 or value > 5:
            raise serializers.ValidationError("La calificación debe estar entre 1 y 5.")
        return value
