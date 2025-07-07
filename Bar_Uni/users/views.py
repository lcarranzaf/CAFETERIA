from rest_framework import generics, status
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, CustomUserSerializer
from .models import CustomUser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from orders.models import Order  # ⬅️ necesario para calcular pedidos y total_gastado
from django.db.models import Sum  # ⬅️ necesario para total_gastado

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    def get_serializer_context(self):
        return {'request': self.request}

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


@api_view(['GET'])
def verificar_username(request):
    username = request.query_params.get('username')
    if username is None:
        return Response({"detail": "Username es requerido"}, status=status.HTTP_400_BAD_REQUEST)

    existe = CustomUser.objects.filter(username=username).exists()
    return Response({"disponible": not existe})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user

    pedidos = Order.objects.filter(usuario=user, estado_pago='verificado').count()
    total_gastado = Order.objects.filter(usuario=user, estado_pago='verificado').aggregate(
        total=Sum('total')
    )['total'] or 0

    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'telefono': user.telefono,
        'estrellas': user.estrellas,
        'is_staff': user.is_staff,
        'pedidos': pedidos,
        'total_gastado': round(total_gastado, 2)
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario_actual(request):
    serializer = CustomUserSerializer(request.user)
    return Response(serializer.data)
