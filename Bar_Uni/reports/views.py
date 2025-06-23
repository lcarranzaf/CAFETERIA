from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from django.utils.timezone import now, timedelta
from orders.models import Order, OrderItem
from django.db.models import Sum

class ResumenVentasView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        hoy = now().date()
        periodo = request.GET.get('periodo', 'dia')  # 'dia', 'semana' o 'mes'

        if periodo == 'semana':
            fecha_inicio = hoy - timedelta(days=hoy.weekday())  # lunes
        elif periodo == 'mes':
            fecha_inicio = hoy.replace(day=1)  # 1er día del mes
        else:
            fecha_inicio = hoy  # solo hoy

        pedidos = Order.objects.filter(
            fecha_orden__date__gte=fecha_inicio,
            estado_reserva='entregado',
            estado_pago='verificado'
        )

        total_recaudado = pedidos.aggregate(total=Sum('total'))['total'] or 0
        total_pedidos = pedidos.count()
        items = OrderItem.objects.filter(order__in=pedidos)

        total_productos = items.aggregate(unidades=Sum('cantidad'))['unidades'] or 0

        mas_vendidos = items.values('menu__nombre') \
            .annotate(cantidad=Sum('cantidad')) \
            .order_by('-cantidad')[:5]  # top 5 platos

        return Response({
            "total_recaudado": round(total_recaudado, 2),
            "total_pedidos": total_pedidos,
            "total_productos": total_productos,
            "mas_vendidos": list(mas_vendidos)  # para el gráfico
        })
