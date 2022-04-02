from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
import jwt

from .models import HypertriviationUser

from .serializers import (HypertrviationUserSerializer,
                          MyTokenObtainPairWithSpotifySerializer)


# Create your views here.
class ObtainTokenPairWithSpotify(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = MyTokenObtainPairWithSpotifySerializer


class HypertrviationUserCreate(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format='json'):
        permission_classes = (permissions.AllowAny,)
        print(request.data)
        serializer = HypertrviationUserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                json = serializer.data
                return Response(json, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class GetHypertriviationUser(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    # serializer_class = UserSerializer
    def get(self, request, format=None, *args, **kwargs):
        serializer = HypertrviationUserSerializer()
        token = request.META.get('HTTP_AUTHORIZATION', '')
        token = jwt.decode(token.split(" ")[-1], settings.SECRET_KEY, algorithms=['HS256'])
        if 'user_id' in token:
            user = HypertriviationUser.objects.filter(id=token['user_id']);
            if user.exists():
                data = HypertrviationUserSerializer(user[0]).data
                return Response(data, status=status.HTTP_200_OK)
        # if fixation_id != None:
            # fixation = Fixation.objects.filter(id=fixation_id)
            # if fixation.exists():
            #     data = FixationSerializer(fixation[0]).data
            #     return Response(data, status=status.HTTP_200_OK)
            return Response({'No user found': 'Invalid user id.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # return Response({'Bad Request': 'Id paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)
