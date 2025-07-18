# Generated by Django 5.2.2 on 2025-06-08 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('reservations', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='reservation',
            name='metodo_pago',
            field=models.CharField(blank=True, choices=[('DEUNA', 'Deuna'), ('PEIGO', 'Peigo')], max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='comprobante_pago',
            field=models.ImageField(blank=True, null=True, upload_to='comprobantes/'),
        ),
    ]
