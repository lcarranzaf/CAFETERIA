from rest_framework import viewsets, permissions
from .models import Menu
from .serializers import MenuSerializer
from users.permissions import IsAdminUser

class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]
