from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Recompensa, RecompensaCanjeada
from .serializers import RecompensaSerializer, RecompensaCanjeadaSerializer

class RecompensaViewSet(viewsets.ModelViewSet):
    queryset = Recompensa.objects.all()
    serializer_class = RecompensaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=True, methods=['post'])
    def canjear(self, request, pk=None):
        recompensa = self.get_object()
        user = request.user

        if user.estrellas < recompensa.estrellas_requeridas:
            return Response(
                {'detail': 'No tienes suficientes estrellas para esta recompensa.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.estrellas -= recompensa.estrellas_requeridas
        user.save()

        # ✅ Registrar el canje
        RecompensaCanjeada.objects.create(usuario=user, recompensa=recompensa)

        return Response(
            {'detail': f'Has canjeado la recompensa: {recompensa.nombre}'},
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='historial', permission_classes=[permissions.IsAuthenticated])
    def historial(self, request):
        canjes = RecompensaCanjeada.objects.filter(usuario=request.user).order_by('-fecha_canje')
        serializer = RecompensaCanjeadaSerializer(canjes, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='historial-todos', permission_classes=[permissions.IsAdminUser])
    def historial_todos(self, request):
        canjes = RecompensaCanjeada.objects.select_related('usuario', 'recompensa').order_by('-fecha_canje')
        serializer = RecompensaCanjeadaSerializer(canjes, many=True)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def recompensas_por_usuario(request, usuario_id):
    recompensas = RecompensaCanjeada.objects.filter(usuario_id=usuario_id).order_by('-fecha_canje')
    serializer = RecompensaCanjeadaSerializer(recompensas, many=True)
    return Response(serializer.data)
