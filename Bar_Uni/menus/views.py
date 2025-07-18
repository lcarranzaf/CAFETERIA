from rest_framework import viewsets, permissions, status
from .models import Menu
from .serializers import MenuSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from users.permissions import IsAdminUser
from django.db import IntegrityError
from rest_framework import serializers
class MenuViewSet(viewsets.ModelViewSet):
    queryset = Menu.objects.all()
    serializer_class = MenuSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'set_destacado']:
            return [IsAdminUser()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise serializers.ValidationError({"nombre": "Ya existe un menú con ese nombre."})

    @action(detail=True, methods=['post'])
    def set_destacado(self, request, pk=None):
        Menu.objects.filter(destacado=True).update(destacado=False)
        menu = self.get_object()
        menu.destacado = True
        menu.save()
        return Response({'status': 'menú marcado como destacado'})
