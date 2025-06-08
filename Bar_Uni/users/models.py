from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20)

    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'telefono']
    USERNAME_FIELD = 'username'  # Puedes cambiarlo a 'email' si prefieres

    def __str__(self):
        return f"{self.username} ({self.email})"
