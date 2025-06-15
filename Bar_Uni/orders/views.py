from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer
from users.permissions import IsAdminUser

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
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        order = self.get_object()
        if order.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede modificar una orden ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='aprobar')
    def aprobar(self, request, pk=None):
        order = self.get_object()
        estado_reserva = request.data.get('estado_reserva')
        estado_pago = request.data.get('estado_pago')

        if estado_reserva:
            order.estado_reserva = estado_reserva
        if estado_pago:
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
