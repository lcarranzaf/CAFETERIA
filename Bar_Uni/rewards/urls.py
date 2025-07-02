from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RecompensaViewSet,  recompensas_por_usuario, RecompensaCanjeadaViewSet  

router = DefaultRouter()
router.register(r'recompensas', RecompensaViewSet, basename='recompensa')
router.register(r'recompensas-canjeadas', RecompensaCanjeadaViewSet, basename='recompensa-canjeada')

urlpatterns = [
    path('', include(router.urls)),
    path('recompensas/usuario/<int:usuario_id>/', recompensas_por_usuario, name='recompensas-por-usuario'),
]
