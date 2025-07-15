from rest_framework import serializers
from .models import Order, OrderItem
from menus.models import Menu
from menus.serializers import MenuSerializer
from users.serializers import UsuarioSimpleSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    menu_nombre = serializers.CharField(source='menu.nombre', read_only=True)
    precio_unitario = serializers.DecimalField(source='menu.precio', max_digits=10, decimal_places=2, read_only=True)
    menu_stock = serializers.IntegerField(source='menu.stock', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu', 'menu_nombre', 'menu_stock', 'precio_unitario', 'cantidad', 'subtotal']
        read_only_fields = ['subtotal', 'menu_nombre', 'precio_unitario', 'menu_stock']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['menu'] = MenuSerializer(instance.menu).data  # incluye detalles completos del menú
        return rep

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
        order = Order.objects.create(**validated_data) 

        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)

        order.actualizar_total()
        return order
