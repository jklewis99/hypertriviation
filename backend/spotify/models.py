from django.db import models
from api.models import Room
from authentication.models import HypertriviationUser

# Create your models here.
class SpotifyToken(models.Model):
    user = models.ForeignKey(HypertriviationUser, null=False, default=1, on_delete=models.CASCADE)
    spotify_id = models.CharField(max_length=64, default="")
    created_at = models.DateTimeField(auto_now_add=True,null=True)
    refresh_token = models.CharField(max_length=150,null=True)
    access_token = models.CharField(max_length=150,null=True)
    expires_in = models.DateTimeField(null=True)
    token_type = models.CharField(max_length=50,null=True)
    def __str__(self):
        return "user: " + self.user.username

    def get_tokens(self):
        return {
            "access": self.access_token,
            "refresh": self.refresh_token
        }

class SpotifyPlaylist(models.Model):
    """
    stores a single spotify playlist instance
    """
    playlist_id = models.CharField(primary_key=True, max_length=64)
    playlist_name = models.CharField(max_length=128)
    # collaborative = models.BooleanField(default=False)
    description = models.CharField(max_length=256)
    href = models.CharField(max_length=256)
    img_url = models.CharField(max_length=256)
    owner_id = models.CharField(max_length=64)
    # playlist_type = models.CharField(max_length=64)
    # playlist_uri = models.CharField(max_length=256)
    def __str__(self):
        return self.playlist_name


class Vote(models.Model):
    user = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    song_id = models.CharField(max_length=50)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        return "user: " + self.user

