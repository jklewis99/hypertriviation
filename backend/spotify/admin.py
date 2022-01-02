from django.contrib import admin
from .models import SpotifyToken, Vote, SpotifyPlaylist

# Register your models here.
admin.site.register(SpotifyToken)
admin.site.register(SpotifyPlaylist)
admin.site.register(Vote)