from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import HypertriviationUser

class MyTokenObtainPairWithSpotifySerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairWithSpotifySerializer, cls).get_token(user)

        # Add custom claims
        token['spotify_authenticated_ind'] = user.spotify_authenticated_ind
        return token

class HypertrviationUserSerializer(serializers.ModelSerializer):
    """
    Currently unused in preference of the below.
    """
    email = serializers.EmailField(
        required=True
    )
    username = serializers.CharField(
        required=True
    )
    first_name = serializers.CharField(
        required=True
    )
    last_name = serializers.CharField(
        required=True
    )
    password = serializers.CharField(min_length=8, write_only=True)

    class Meta:
        model = HypertriviationUser
        fields = ('email', 'id', 'username', 'first_name', 'last_name', 'password', 'spotify_authenticated_ind')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)  # as long as the fields are the same, we can just use this
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


