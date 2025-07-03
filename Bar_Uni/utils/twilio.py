from twilio.rest import Client
from django.conf import settings

def enviar_whatsapp(numero_destino, mensaje):
    client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

    message = client.messages.create(
        from_=settings.TWILIO_WHATSAPP_NUMBER,
        body=mensaje,
        to=f'whatsapp:{+593997811592}'
    )
    return message.sid
