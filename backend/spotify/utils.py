from authentication.models import HypertriviationUser
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import CLIENT_ID, CLIENT_SECRET
from requests import post, put, get
import logging
import traceback


BASE_URL = "https://api.spotify.com/v1/"


def get_user_tokens(user):
    try:
        user_tokens = SpotifyToken.objects.filter(user=user)
        if user_tokens.exists():
            return user_tokens[0]
        else:
            return None
    except Exception as e:
        logging.error("Error in get_user_tokens: " + traceback.format_exc())

def update_or_create_user_tokens(user, access_token, refresh_token, token_type, expires_in):
    tokens = get_user_tokens(user=user)
    # convert expires_in seconds to a datetime type; subtract a 5 minute buffer
    expires_in = timezone.now() + timedelta(seconds=expires_in - 600)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.save(update_fields=['access_token', 'refresh_token', 'expires_in', 'token_type'])
    else:
        spotify_user = get_me(None, tokens = {"access_token": access_token})
        spotify_id = ""
        if spotify_user:
            spotify_id = spotify_user.get("id")
        tokens = SpotifyToken(user=user, access_token=access_token, spotify_id=spotify_id,
                            refresh_token=refresh_token, token_type=token_type, expires_in=expires_in)
        tokens.save()
        user.spotify_authenticated_ind = True
        user.save(update_fields=['spotify_authenticated_ind'])
    return tokens.get_tokens();


def is_spotify_authenticated(user):
    tokens = get_user_tokens(user=user)
    if tokens:
        expiry = tokens.expires_in
        if expiry <= timezone.now():
            refresh_spotify_token(user)

        return True

    return False

def refresh_spotify_token(user):
    refresh_token = get_user_tokens(user=user).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    return update_or_create_user_tokens(
        user, access_token, refresh_token, token_type, expires_in)

def execute_spotify_api_request(user, endpoint, post_=False, put_=False, tokens=None):
    if not tokens:
        tokens = get_user_tokens(user)
        access_token = tokens.access_token
    else:
        access_token = tokens["access_token"]
    
    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + access_token}

    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        return put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, {}, headers=headers)
    try:
        return response.json()
    except:
        return {'Error': 'Issue with request'}

def get_me(user, tokens=None):
    return execute_spotify_api_request(user, "me", tokens=tokens)

def play_song(user):
    return execute_spotify_api_request(user, "me/player/play", put_=True)

def pause_song(user):
    return execute_spotify_api_request(user, "me/player/pause", put_=True)

def skip_song(user):
    return execute_spotify_api_request(user, "me/player/next", post_=True)

def get_playlists(user):
    return execute_spotify_api_request(user, "me/playlists")

def shuffle_playlist(user, state, device_id):
    return execute_spotify_api_request(user, f"me/player/shuffle?state={state}", put_=True)
