from rest_framework import viewsets, permissions
from .models import Notificacion
from .serializers import NotificacionSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

class NotificacionViewSet(viewsets.ModelViewSet):
    serializer_class = NotificacionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notificacion.objects.filter(usuario=self.request.user).order_by('-creado_en')

    def perform_update(self, serializer):
        serializer.save(leido=True)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def marcar_como_leidas(request):
    notificaciones = Notificacion.objects.filter(usuario=request.user, leido=False)
    notificaciones.update(leido=True)
    return Response({"mensaje": "Notificaciones marcadas como leídas"}, status=status.HTTP_200_OK)
