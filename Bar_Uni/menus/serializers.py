from rest_framework import serializers
from .models import Menu
from reviews.models import Review  
from django.db.models import Avg

class MenuSerializer(serializers.ModelSerializer):
    promedio_calificacion = serializers.SerializerMethodField()
    cantidad_reviews = serializers.SerializerMethodField()
    estrellas = serializers.SerializerMethodField()

    class Meta:
        model = Menu
        fields = '__all__'

    def get_promedio_calificacion(self, obj):
        promedio = Review.objects.filter(menu=obj).aggregate(avg=Avg('calificacion'))['avg']
        return round(promedio, 1) if promedio is not None else 5.0

    def get_cantidad_reviews(self, obj):
        return Review.objects.filter(menu=obj).count()

    def validate_nombre(self, value):
        if self.instance:
            if Menu.objects.filter(nombre__iexact=value).exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("Ya existe un menú con ese nombre.")
        else:
            if Menu.objects.filter(nombre__iexact=value).exists():
                raise serializers.ValidationError("Ya existe un menú con ese nombre.")
        return value
    
    def get_estrellas(self, obj):
        reviews = Review.objects.filter(menu=obj)
        if reviews.exists():
            return round(reviews.aggregate(promedio=Avg('calificacion'))['promedio'], 1)
        return 0
