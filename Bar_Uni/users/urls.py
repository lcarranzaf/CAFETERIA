from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView,profile_view, verificar_username  
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', profile_view, name='profile'),
    path('verificar-username/', verificar_username),
]
