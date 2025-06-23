# orders/serializers.py
from rest_framework import serializers
from .models import Order, OrderItem
from menus.models import Menu
from users.serializers import UsuarioSimpleSerializer  # importa el serializer del usuario

class OrderItemSerializer(serializers.ModelSerializer):
    menu_nombre = serializers.CharField(source='menu.nombre', read_only=True)
    precio_unitario = serializers.DecimalField(source='menu.precio', max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu', 'menu_nombre', 'precio_unitario', 'cantidad', 'subtotal']
        read_only_fields = ['subtotal', 'menu_nombre', 'precio_unitario']

    def validate_cantidad(self, value):
        if value <= 0:
            raise serializers.ValidationError("La cantidad debe ser mayor que cero.")
        return value


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    usuario = UsuarioSimpleSerializer(read_only=True) 

    class Meta:
        model = Order
        fields = [
            'id', 'usuario', 'fecha_orden', 'estado_reserva', 'estado_pago',
            'metodo_pago', 'comprobante_pago', 'total', 'items'
        ]
        read_only_fields = ['id', 'usuario', 'fecha_orden', 'total']

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("Debes agregar al menos un menú a la orden.")
        return value

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        usuario = validated_data.pop('usuario')
        order = Order.objects.create(usuario=usuario, **validated_data)

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        order.actualizar_total()
        return order
