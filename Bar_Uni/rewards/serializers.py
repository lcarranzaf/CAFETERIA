from rest_framework import serializers
from .models import Recompensa, RecompensaCanjeada

class RecompensaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recompensa
        fields = ['id', 'nombre', 'descripcion', 'estrellas_requeridas']


class RecompensaCanjeadaSerializer(serializers.ModelSerializer):
    recompensa_nombre = serializers.CharField(source='recompensa.nombre', read_only=True)
    recompensa_descripcion = serializers.CharField(source='recompensa.descripcion', read_only=True)
    usuario_nombre = serializers.SerializerMethodField()

    class Meta:
        model = RecompensaCanjeada
        fields = ['id', 'usuario_nombre', 'recompensa_nombre', 'recompensa_descripcion', 'fecha_canje', 'estado_entrega']

    def get_usuario_nombre(self, obj):
        return f"{obj.usuario.first_name} {obj.usuario.last_name}" if obj.usuario else None
