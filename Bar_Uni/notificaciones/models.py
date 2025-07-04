from django.db import models
from users.models import CustomUser 

class Notificacion(models.Model):
    usuario = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="notificaciones")
    mensaje = models.TextField()
    leido = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notif. para {self.usuario.username}: {self.mensaje[:30]}"

