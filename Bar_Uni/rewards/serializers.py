from rest_framework import serializers
from .models import Recompensa, RecompensaCanjeada

class RecompensaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recompensa
        fields = ['id', 'nombre', 'descripcion', 'estrellas_requeridas', 'activo']


class RecompensaCanjeadaSerializer(serializers.ModelSerializer):
    recompensa_nombre = serializers.CharField(source='recompensa.nombre', read_only=True)
    recompensa_descripcion = serializers.CharField(source='recompensa.descripcion', read_only=True)
    recompensa_id = serializers.IntegerField(source='recompensa.id', read_only=True)
    usuario_nombre = serializers.SerializerMethodField()
    usuario_id = serializers.IntegerField(source='usuario.id', read_only=True)

    class Meta:
        model = RecompensaCanjeada
        fields = [
            'id',
            'usuario_id',
            'usuario_nombre',
            'recompensa_id',
            'recompensa_nombre',
            'recompensa_descripcion',
            'fecha_canje',
            'estado_entrega'
        ]

    def get_usuario_nombre(self, obj):
        if obj.usuario.first_name or obj.usuario.last_name:
            return f"{obj.usuario.first_name} {obj.usuario.last_name}".strip()
        return obj.usuario.username
