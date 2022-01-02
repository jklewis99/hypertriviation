from django.conf import settings
import jwt

def decrypt_auth_header(request):
    token = request.META.get('HTTP_AUTHORIZATION', '')
    return jwt.decode(token.split(" ")[-1], settings.SECRET_KEY, algorithms=['HS256'])