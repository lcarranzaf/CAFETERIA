from rest_framework import serializers
from .models import Reservation

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
        read_only_fields = ('usuario', 'fecha_reserva', 'estado_pago', 'estado_reserva')

    def validate(self, data):
        comprobante = data.get('comprobante_pago')
        metodo = data.get('metodo_pago')
        if comprobante:
            if not metodo:
                raise serializers.ValidationError({
                    'metodo_pago': 'Debes especificar el método de pago si vas a subir un comprobante.'
                })
            if metodo not in ['DEUNA', 'PEIGO']:
                raise serializers.ValidationError({
                    'metodo_pago': 'El método de pago debe ser DEUNA o PEIGO.'
                })

        return data
