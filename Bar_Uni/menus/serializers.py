from rest_framework import serializers
from .models import Menu
from reviews.models import Review  
from django.db.models import Avg, Count

class MenuSerializer(serializers.ModelSerializer):
    promedio_calificacion = serializers.SerializerMethodField()
    cantidad_reviews = serializers.SerializerMethodField()
    class Meta:
        model = Menu
        fields = '__all__'
    
    def get_promedio_calificacion(self, obj):
        promedio = Review.objects.filter(menu=obj).aggregate(avg=Avg('calificacion'))['avg']
        return round(promedio, 1) if promedio is not None else 5.0
    
    def get_cantidad_reviews(self, obj):
        return Review.objects.filter(menu=obj).count()

