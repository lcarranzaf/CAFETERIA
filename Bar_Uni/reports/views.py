from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now, timedelta
from orders.models import Order, OrderItem
from menus.models import Menu
from django.db.models import Sum

class ResumenVentasView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        hoy = now().date()
        fecha_desde = request.GET.get('fecha_desde', hoy)
        fecha_hasta = request.GET.get('fecha_hasta', hoy)

        pedidos = Order.objects.filter(
            fecha_orden__date__gte=fecha_desde,
            fecha_orden__date__lte=fecha_hasta,
            estado_reserva='entregado',
            estado_pago='verificado'
        )

        total_recaudado = pedidos.aggregate(total=Sum('total'))['total'] or 0
        total_pedidos = pedidos.count()
        items = OrderItem.objects.filter(order__in=pedidos)

        total_productos = items.aggregate(unidades=Sum('cantidad'))['unidades'] or 0

        # Obtener todos los menús y su cantidad vendida (0 si no se vendió)
        todos_los_menus = Menu.objects.all()
        ventas_por_producto = []

        for menu in todos_los_menus:
            cantidad_vendida = items.filter(menu=menu).aggregate(total=Sum('cantidad'))['total'] or 0
            ventas_por_producto.append({
                'menu': menu.nombre,
                'cantidad': cantidad_vendida
            })

        return Response({
            "total_recaudado": round(total_recaudado, 2),
            "total_pedidos": total_pedidos,
            "total_productos": total_productos,
            "mas_vendidos": ventas_por_producto
        })
