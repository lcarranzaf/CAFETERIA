from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView  # 👈 Importa la vista personalizada
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # 👈 Usa tu vista personalizada
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
