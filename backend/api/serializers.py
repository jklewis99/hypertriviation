from rest_framework import serializers
from .models import Fixation, FixationSession, FixationSessionPlayer, FixationSessionSettings, Room, User


class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('id', 'code', 'host', 'guest_can_pause',
                  'votes_to_skip', 'created_at')

class CreateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip')

class UpdateRoomSerializer(serializers.ModelSerializer):
    # redefine code field so we reference a "different" code field (code won't be unique in this request)
    code = serializers.CharField(validators=[])

    class Meta:
        model = Room
        fields = ('guest_can_pause', 'votes_to_skip', 'code')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'spotify_authenticated_ind', 'email', 'created_at', 'created_at')

class FixationSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(source='created_by.username')
    class Meta:
        model = Fixation
        fields = ('id', 'created_by', 'fixation_title', 'description', 'category', 'img_url', 'rating', 'created_at')

class FixationSessionSerializer(serializers.ModelSerializer):
    fixation_id = serializers.CharField(source='fixation.id')
    class Meta:
        model = FixationSession
        fields = ('code', 'host', 'fixation_id', 'created_at', 'current_song')
    pass

class StartFixationSessionSerializer(serializers.ModelSerializer):
    # redefine code field so we reference a "different" code field (code won't be unique in this request)
    # code = serializers.CharField(validators=[])
    fixation_id = serializers.CharField(source='fixation.id')
    class Meta:
        model = FixationSession
        fields = ('fixation_id',)

class GetFixationSessionPlayersSerializer(serializers.ModelSerializer):
    fixation_session_code = serializers.CharField(source='fixation_session.code')
    class Meta:
        model = FixationSessionPlayer
        fields = ('fixation_session_code', 'display_name', 'player_session_id', 'active_ind', 'added_at')

class FixationSessionSettingsSerializer(serializers.ModelSerializer):
    fixation_session_code = serializers.CharField(source='fixation_session.code')
    class Meta:
        model = FixationSessionSettings
        fields = ('fixation_session_code', 'show_hints_ind', 'multiple_choice_ind', 'random_shuffle_ind',
                    'stop_on_answer_ind', 'time_limit', 'active_ind', 'created_ts')

