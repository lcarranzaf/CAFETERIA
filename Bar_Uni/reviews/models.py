from django.db import models
from django.conf import settings
from menus.models import Menu  # Ajusta el import si es diferente

class Review(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name='reviews')
    comentario = models.TextField()
    calificacion = models.PositiveSmallIntegerField() 
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'menu')  

    def __str__(self):
        return f"{self.usuario} - {self.menu} - {self.calificacion}/5"
