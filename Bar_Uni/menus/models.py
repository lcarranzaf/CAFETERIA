from django.db import models

class Menu(models.Model):
    TIPO_CHOICES = [
        ('desayuno', 'Desayuno'),
        ('almuerzo', 'Almuerzo'),
        ('piqueo', 'Piqueo'),
        ('bebida', 'Bebida'),
    ]

    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=6, decimal_places=2)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    disponible = models.BooleanField(default=True)
    imagen = models.ImageField(upload_to='menus/', null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=False, auto_now=True)
    destacado = models.BooleanField(default=False)
    def __str__(self):
        return self.nombre