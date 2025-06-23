from django.db import models
from django.conf import settings

class Recompensa(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    estrellas_requeridas = models.PositiveIntegerField()

    def __str__(self):
        return self.nombre

class RecompensaCanjeada(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recompensas_canjeadas')
    recompensa = models.ForeignKey(Recompensa, on_delete=models.CASCADE)
    fecha_canje = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.usuario.username} canjeó {self.recompensa.nombre} en {self.fecha_canje}"