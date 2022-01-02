from django.shortcuts import render, redirect

from authentication.models import HypertriviationUser
from authentication.serializers import HypertrviationUserSerializer
from global_utils.token_decrypt import decrypt_auth_header
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .utils import *
from api.models import Room
from .models import Vote
import jwt
# Step 1: take the url that is returned and redirect to that page
# Step 2: redirect to the spotify callback function and acquire the tokens
# step 3: redirect back to the original application (frontend)
GLOBAL_USER = 0

class AuthURL(APIView):
    def get(self, request, format=None):
        '''return the request to be used by the front end'''
        scopes = """user-read-playback-state
                    user-modify-playback-state
                    user-read-currently-playing
                    user-library-read
                    user-read-email
                    user-read-private
                    streaming
                    """

        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url
        # send back the spotify sign in page url
        return Response({'url': url}, status=status.HTTP_200_OK)


def spotify_callback(request, format=None):
    code = request.GET.get('code')
    error = request.GET.get('error')
    # redirect to the spotify callback function and acquire the tokens
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': REDIRECT_URI,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    # redirect back to the original application (frontend)
    return redirect(f'http://localhost:3000/user/myaccount?accessToken={access_token}&refreshToken={refresh_token}&expiresIn={expires_in}&tokenType={token_type}&error={error if error is not None else ""}')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        userId = request.GET.get('userId', None)
        if userId != None:
            user = HypertriviationUser.objects.filter(id=userId)
            if user.exists():
                is_authenticated = is_spotify_authenticated(user[0])
                return Response({'status': is_authenticated}, status=status.HTTP_200_OK)
            return Response({"Not found": "No user found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request": "userId not found in request"}, status=status.HTTP_400_BAD_REQUEST)

class SetSpotifyAuthentication(APIView):
    def post(self, request, format=None):
        user_id = request.data.get('userId')
        access_token = request.data.get('accessToken')
        refresh_token = request.data.get('refreshToken')
        expires_in = request.data.get('expiresIn')
        token_type = request.data.get('tokenType')
        if user_id and access_token and refresh_token and expires_in and token_type:
            expires_in = int(expires_in)
            user = HypertriviationUser.objects.filter(id=user_id)
            if user.exists():
                tokens = update_or_create_user_tokens(user[0], access_token, refresh_token, token_type, expires_in)
                return Response({'status': "success"}, status=status.HTTP_201_CREATED)
            return Response({"Not found": "No user found"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request": "Missing required fields in request"}, status=status.HTTP_400_BAD_REQUEST)

class GetSpotifyTokens(APIView):
    def get(self, request):
        user_id = request.GET.get('userId', None)
        if user_id:
            user = HypertriviationUser.objects.filter(id=user_id)
            if user.exists() and is_spotify_authenticated(user[0]):
                tokens = get_user_tokens(user=user[0])
                if tokens:
                    expiry = tokens.expires_in
                    if expiry <= timezone.now():
                        tokens = refresh_spotify_token(user)
                    return Response({'access_token': tokens.access_token,
                                    'refresh_token': tokens.refresh_token}, status=status.HTTP_200_OK)
            return Response({"Not Found": "User is not authenticated for Spotify"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request": "Missing userId"}, status=status.HTTP_400_BAD_REQUEST)

class GetMyPlaylists(APIView):
    def get(self, request):
        user_id = request.GET.get('userId', None)
        if user_id:
            user = HypertriviationUser.objects.filter(id=user_id)
            if user.exists() and is_spotify_authenticated(user[0]):
                playlists = get_playlists(user[0])
                # print(playlists)
                return Response(playlists, status=status.HTTP_200_OK)
            return Response({"Not Found": "User is not authenticated for Spotify"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request": "Missing userId"}, status=status.HTTP_400_BAD_REQUEST)

class SetToShuffle(APIView):
    def put(self, request):
        state = request.GET.get('state', "true")
        device_id = request.GET.get('deviceId', "")
        token = decrypt_auth_header(request)
        user_id = token["user_id"]
        if user_id:
            user = HypertriviationUser.objects.filter(id=user_id)
            if user.exists() and is_spotify_authenticated(user[0]):
                response = shuffle_playlist(user[0], state=state, device_id=device_id)
                # print(playlists)
                return Response(response, status=status.HTTP_200_OK)
            return Response({"Not Found": "User is not authenticated for Spotify"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"Bad Request": "Missing userId"}, status=status.HTTP_400_BAD_REQUEST)