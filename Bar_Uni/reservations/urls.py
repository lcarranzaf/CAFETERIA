from rest_framework.routers import DefaultRouter
from .views import ReservationViewSet

router = DefaultRouter()
router.register(r'reservas',ReservationViewSet)

urlpatterns = router.urls