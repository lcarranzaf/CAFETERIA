from django.db import models
from django.conf import settings
from menus.models import Menu

class Reservation(models.Model):
    ESTADO_PAGO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('verificado', 'Verificado'),
        ('rechazado', 'Rechazado'),
    ]

    ESTADO_RESERVA_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
        ('entregado','Entregado'),
    ]
    METODO_PAGO_CHOICES = [
        ('DEUNA', 'Deuna'),
        ('PEIGO', 'Peigo'),
    ]

    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    fecha_reserva = models.DateTimeField(auto_now_add=True)
    comprobante_pago = models.ImageField(upload_to='comprobantes/', blank=True, null=True) 
    metodo_pago = models.CharField(max_length=10, choices=METODO_PAGO_CHOICES, blank=True, null=True)
    estado_pago = models.CharField(max_length=20, choices=ESTADO_PAGO_CHOICES, default='pendiente')
    estado_reserva = models.CharField(max_length=20, choices=ESTADO_RESERVA_CHOICES, default='pendiente')

    def __str__(self):
        return f"Reserva de {self.usuario.username} - {self.menu.nombre}"
