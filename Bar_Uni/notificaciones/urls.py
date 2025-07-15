from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import NotificacionViewSet, marcar_como_leidas

router = DefaultRouter()
router.register(r'notificaciones', NotificacionViewSet, basename='notificacion')

urlpatterns = [
    path('notificaciones/marcar_como_leidas/', marcar_como_leidas, name='marcar_como_leidas'),
    path('', include(router.urls)),
]
