# Generated by Django 5.2.2 on 2025-06-08 02:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('menus', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Reservation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('fecha_reserva', models.DateTimeField(auto_now_add=True)),
                ('comprobante_pago', models.ImageField(upload_to='comprobantes/')),
                ('estado_pago', models.CharField(choices=[('pendiente', 'Pendiente'), ('verificado', 'Verificado'), ('rechazado', 'Rechazado')], default='pendiente', max_length=20)),
                ('estado_reserva', models.CharField(choices=[('pendiente', 'Pendiente'), ('aceptado', 'Aceptado'), ('rechazado', 'Rechazado'), ('entregado', 'Entregado')], default='pendiente', max_length=20)),
                ('menu', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='menus.menu')),
                ('usuario', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
