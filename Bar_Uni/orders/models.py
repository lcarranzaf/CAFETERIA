from django.db import models
from django.conf import settings
from menus.models import Menu
from decimal import Decimal

class Order(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    fecha_orden = models.DateTimeField(auto_now_add=True)
    
    estado_reserva = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('aceptado', 'Aceptado'),
        ('rechazado', 'Rechazado'),
        ('entregado', 'Entregado'),
    ], default='pendiente')
    
    estado_pago = models.CharField(max_length=20, choices=[
        ('pendiente', 'Pendiente'),
        ('verificado', 'Verificado'),
        ('rechazado', 'Rechazado'),
    ], default='pendiente')
    
    metodo_pago = models.CharField(max_length=10, choices=[
        ('DEUNA', 'Deuna'),
        ('PEIGO', 'Peigo'),
    ], blank=True, null=True)
    
    comprobante_pago = models.ImageField(upload_to='comprobantes/', blank=True, null=True)

    total = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00')) 
    pago_verificado = models.BooleanField(default=False)
    
    id = models.AutoField(primary_key=True)

    def actualizar_total(self):
        total = sum(item.subtotal for item in self.items.all())  
        self.total = total
        self.save()

    def __str__(self):
        return f"Orden #{self.id} de {self.usuario.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField(default=1)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('0.00')) 
    stock_descuentado = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.subtotal = self.menu.precio * self.cantidad
        super().save(*args, **kwargs)
        self.order.actualizar_total()

    def __str__(self):
        return f"{self.menu.nombre} x {self.cantidad}"
