from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class HypertriviationUser(AbstractUser):
    """
    Stores a single user entry
    """
    # username = models.CharField(max_length=32, unique=True)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    spotify_authenticated_ind = models.BooleanField(null=False, default=False)
    # email = models.CharField(max_length=64)
    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username + " " + self.last_name