from django.urls import path
from .views import *
urlpatterns = [
    path('get-auth-url', AuthURL.as_view()),
    path('redirect', spotify_callback),
    path('is-authenticated', IsAuthenticated.as_view()),
    path('set-tokens', SetSpotifyAuthentication.as_view()),
    path('get-tokens', GetSpotifyTokens.as_view()),
    path('get-playlists', GetMyPlaylists.as_view()),
    path('shuffle', SetToShuffle.as_view()),
]