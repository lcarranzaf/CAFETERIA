from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Reservation
from .serializers import ReservationSerializer
from users.permissions import IsAdminUser

class ReservationViewSet(viewsets.ModelViewSet):
    queryset = Reservation.objects.all()
    serializer_class = ReservationSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'list', 'aprobar']:
            return [IsAdminUser()]
        elif self.action in ['create', 'upload_comprobante']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            if user.is_staff: 
                return Reservation.objects.all()
            else:  
                return Reservation.objects.filter(usuario=user)
        return Reservation.objects.none()
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)
        
    def update(self, request, *args, **kwargs):
        reserva = self.get_object()
        if reserva.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede modificar una reserva ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().update(request, *args, **kwargs)
    
    def destroy(self, request, *args, **kwargs):
        reserva = self.get_object()
        if reserva.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede eliminar una reserva ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        reserva = self.get_object()
        if reserva.estado_reserva == 'entregado':
            return Response({'detail': 'No se puede modificar una reserva ya entregada.'}, status=status.HTTP_400_BAD_REQUEST)
        return super().partial_update(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='aprobar')
    def aprobar(self, request, pk=None):
        reserva = self.get_object()
        estado_reserva = request.data.get('estado_reserva')
        estado_pago = request.data.get('estado_pago')

        if estado_reserva:
            reserva.estado_reserva = estado_reserva
        if estado_pago:
            reserva.estado_pago = estado_pago

        reserva.save()
        serializer = self.get_serializer(reserva)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def upload_comprobante(self, request, pk=None):
        reserva = self.get_object()

        if reserva.usuario != request.user:
            return Response({'detail': 'No tienes permiso para modificar esta reserva.'}, status=status.HTTP_403_FORBIDDEN)

        if reserva.comprobante_pago:
            return Response({'detail': 'Ya has subido un comprobante.'}, status=status.HTTP_400_BAD_REQUEST)

        comprobante = request.FILES.get('comprobante_pago')
        metodo = request.data.get('metodo_pago')


        if not comprobante:
            return Response({'detail': 'Debes subir una imagen del comprobante.'}, status=status.HTTP_400_BAD_REQUEST)

        if metodo not in ['DEUNA', 'PEIGO']:
            return Response({'detail': 'Método de pago inválido. Solo se acepta DEUNA o PEIGO.'}, status=status.HTTP_400_BAD_REQUEST)


        reserva.comprobante_pago = comprobante
        reserva.metodo_pago = metodo
        reserva.estado_pago = 'pendiente'
        reserva.save()

        serializer = self.get_serializer(reserva)
        return Response(serializer.data, status=status.HTTP_200_OK)
