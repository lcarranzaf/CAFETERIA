# orders/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order, OrderItem
from .serializers import OrderSerializer
from users.permissions import IsAdminUser
from math import floor
from menus.models import Menu
from django.db.models import Sum
from django.db import models

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'aprobar']:
            return [IsAdminUser()]
        elif self.action in ['create', 'upload_comprobante', 'list']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_staff:
                return Order.objects.all()
            else:
                return Order.objects.filter(usuario=user)
        return Order.objects.none()

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)

    def destroy(self, request, *args, **kwargs):
        order = self.get_object()
        if order.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede eliminar una orden ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        order = self.get_object()
        if order.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede modificar una orden ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)

        estado_pago_anterior = order.estado_pago
        response = super().update(request, *args, **kwargs)
        order.refresh_from_db()

        if estado_pago_anterior != 'verificado' and order.estado_pago == 'verificado' and not order.pago_verificado:
            user = order.usuario
            estrellas_ganadas = floor(order.total)
            user.estrellas += estrellas_ganadas
            user.save()
            order.pago_verificado = True
            order.save()

        return response

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        if order.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede modificar una orden ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)

        estado_pago_anterior = order.estado_pago
        estado_reserva_anterior = order.estado_reserva

        response = super().partial_update(request, *args, **kwargs)
        order.refresh_from_db()

        if estado_reserva_anterior != 'aceptado' and order.estado_reserva == 'aceptado':
            for item in order.items.all():
                if not item.stock_descuentado:
                    menu = item.menu
                    if menu.stock < item.cantidad:
                        return Response(
                            {'error': f"Stock insuficiente para {menu.nombre}. Disponible: {menu.stock}, solicitado: {item.cantidad}"},
                            status=status.HTTP_400_BAD_REQUEST
                        )
            for item in order.items.all():
                if not item.stock_descuentado:
                    menu = item.menu
                    menu.stock -= item.cantidad
                    menu.save()
                    item.stock_descuentado = True
                    item.save()

        if estado_pago_anterior != 'verificado' and order.estado_pago == 'verificado' and not order.pago_verificado:
            user = order.usuario
            estrellas_ganadas = floor(order.total)
            user.estrellas += estrellas_ganadas
            user.save()
            order.pago_verificado = True
            order.save()

        return response

    @action(detail=True, methods=['patch'], url_path='aprobar')
    def aprobar(self, request, pk=None):
        order = self.get_object()
        estado_reserva = request.data.get('estado_reserva')
        estado_pago = request.data.get('estado_pago')

        if estado_pago == "rechazado":
            estado_reserva = "rechazado"
        elif estado_reserva == "rechazado":
            estado_pago = "rechazado"

        if estado_reserva:
            if estado_reserva == 'aceptado':
                for item in order.items.all():
                    if not item.stock_descuentado:
                        menu = item.menu
                        if menu.stock < item.cantidad:
                            return Response(
                                {'error': f"Stock insuficiente para {menu.nombre}. Disponible: {menu.stock}, solicitado: {item.cantidad}"},
                                status=status.HTTP_400_BAD_REQUEST
                            )
                for item in order.items.all():
                    if not item.stock_descuentado:
                        menu = item.menu
                        menu.stock -= item.cantidad
                        menu.save()
                        item.stock_descuentado = True
                        item.save()
            order.estado_reserva = estado_reserva

        if estado_pago:
            if estado_pago == "verificado" and not order.pago_verificado:
                user = order.usuario
                estrellas_ganadas = floor(order.total)
                user.estrellas += estrellas_ganadas
                user.save()
                order.pago_verificado = True

            order.estado_pago = estado_pago

        order.save()
        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated])
    def upload_comprobante(self, request, pk=None):
        order = self.get_object()

        if order.usuario != request.user:
            return Response({'detail': 'No tienes permiso para modificar esta orden.'}, status=status.HTTP_403_FORBIDDEN)

        if order.comprobante_pago:
            return Response({'detail': 'Ya has subido un comprobante.'}, status=status.HTTP_400_BAD_REQUEST)

        comprobante = request.FILES.get('comprobante_pago')
        metodo = request.data.get('metodo_pago')

        if not comprobante:
            return Response({'detail': 'Debes subir una imagen del comprobante.'}, status=status.HTTP_400_BAD_REQUEST)

        if metodo not in ['DEUNA', 'PEIGO']:
            return Response({'detail': 'Método de pago inválido. Solo se acepta DEUNA o PEIGO.'}, status=status.HTTP_400_BAD_REQUEST)

        order.comprobante_pago = comprobante
        order.metodo_pago = metodo
        order.estado_pago = 'pendiente'
        order.save()

        serializer = self.get_serializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='productos-vendidos', permission_classes=[IsAdminUser])
    def productos_vendidos(self, request):
        fecha_desde = request.GET.get('fecha_desde')
        fecha_hasta = request.GET.get('fecha_hasta')

        filtros = {
            "order__estado_reserva": "entregado",
            "order__estado_pago": "verificado"
        }
        if fecha_desde and fecha_hasta:
            filtros["order__fecha_orden__date__range"] = [fecha_desde, fecha_hasta]

        items = OrderItem.objects.filter(**filtros)
        vendidos = items.values(menu=models.F('menu__nombre')) \
                        .annotate(cantidad=Sum('cantidad')) \
                        .order_by('-cantidad')

        return Response(list(vendidos))

    @action(detail=False, methods=['get'], url_path='pedidos-completados', permission_classes=[IsAdminUser])
    def pedidos_completados(self, request):
        fecha_desde = request.GET.get('fecha_desde')
        fecha_hasta = request.GET.get('fecha_hasta')

        pedidos = Order.objects.filter(
            estado_reserva='entregado',
            estado_pago='verificado'
        )
        if fecha_desde and fecha_hasta:
            pedidos = pedidos.filter(fecha_orden__date__range=[fecha_desde, fecha_hasta])

        serializer = self.get_serializer(pedidos, many=True)
        return Response(serializer.data)
