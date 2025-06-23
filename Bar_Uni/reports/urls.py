# reports/urls.py
from django.urls import path
from .views import ResumenVentasView

urlpatterns = [
    path('resumen-ventas/', ResumenVentasView.as_view()),
]
