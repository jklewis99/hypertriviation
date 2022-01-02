from rest_framework import serializers

from .models import SpotifyPlaylist

class SpotifyPlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyPlaylist
        fields = ('playlist_id', 'playlist_name', 'description', 'href',
                  'img_url', 'owner_id')
