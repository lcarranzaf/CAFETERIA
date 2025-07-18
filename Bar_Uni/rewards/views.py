from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from .models import Recompensa, RecompensaCanjeada
from .serializers import RecompensaSerializer, RecompensaCanjeadaSerializer

class RecompensaViewSet(viewsets.ModelViewSet):
    queryset = Recompensa.objects.all() 
    serializer_class = RecompensaSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'toggle_estado']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        mostrar_todas = self.request.query_params.get("todas") == "true"
        if mostrar_todas:
            return Recompensa.objects.all()
        return Recompensa.objects.filter(activo=True)

    def get_object(self):
        """Permite acceder a recompensas aunque estén inactivas."""
        return Recompensa.objects.get(pk=self.kwargs["pk"])

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def toggle_estado(self, request, pk=None):
        recompensa = self.get_object()
        recompensa.activo = not recompensa.activo
        recompensa.save()
        estado = "activada" if recompensa.activo else "desactivada"
        return Response({'detail': f'Recompensa {estado} correctamente.'})

    @action(detail=True, methods=['post'])
    def canjear(self, request, pk=None):
        recompensa = self.get_object()
        user = request.user

        if not recompensa.activo:
            return Response({'detail': 'Esta recompensa está desactivada.'}, status=400)

        if user.estrellas < recompensa.estrellas_requeridas:
            return Response({'detail': 'No tienes suficientes estrellas para esta recompensa.'}, status=400)

        user.estrellas -= recompensa.estrellas_requeridas
        user.save()

        RecompensaCanjeada.objects.create(
            usuario=user,
            recompensa=recompensa,
            estado_entrega='pendiente'
        )

        return Response({'detail': f'Has canjeado la recompensa: {recompensa.nombre}'}, status=200)

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



class RecompensaCanjeadaViewSet(viewsets.ModelViewSet):
    queryset = RecompensaCanjeada.objects.select_related('usuario', 'recompensa').all()
    serializer_class = RecompensaCanjeadaSerializer
    permission_classes = [permissions.IsAdminUser]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        estado_nuevo = request.data.get('estado_entrega')
        if estado_nuevo not in ['pendiente', 'entregado']:
            return Response({'error': 'Estado inválido'}, status=400)

        instance.estado_entrega = estado_nuevo
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def recompensas_por_usuario(request, usuario_id):
    recompensas = RecompensaCanjeada.objects.filter(usuario_id=usuario_id).order_by('-fecha_canje')
    serializer = RecompensaCanjeadaSerializer(recompensas, many=True)
    return Response(serializer.data)
