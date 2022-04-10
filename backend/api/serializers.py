from rest_framework import serializers
from .models import Fixation, FixationAnswer, FixationQuestion, FixationSession, FixationSessionPlayer, FixationSessionSettings, Room, TimeLimitOptions, User


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
        fields = (
            'id',
            'created_by',
            'fixation_title',
            'category',
            'description',
            'img_url',
            'keep_shuffled',
            'spotify_playlist_id',
            'spotify_random_start_ind',
            'default_duration',
            'question_count',
            'rating',
            'created_at',
            'updated_at'
        )



class FixationAnswerSerializer(serializers.ModelSerializer):
    question_id = serializers.IntegerField(source='question.id')
    class Meta:
        model = FixationAnswer
        fields = (
            'id',
            'question_id',
            'answer_txt',
            'correct_answer_ind',
            'created_by',
            'created_at', 
            'updated_at'
        )

class FixationQuestionSerializer(serializers.ModelSerializer):
    fixation_id = serializers.IntegerField(source='fixation.id')
    answers = FixationAnswerSerializer(many=True)

    class Meta:
        model = FixationQuestion
        fields = (
            'id',
            'fixation_id',
            'question_idx', 
            'question_txt',
            'multiple_choice_ind', 
            'img_url',
            'video_playback_url',
            'created_by',
            'question_category',
            'created_at', 
            'updated_at',
            'answers'
        )
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

    # fixation_session = serializers.SlugRelatedField(FixationSession.objects.all())
    # fixation_sessiona = serializers.RelatedField
    show_hints_ind = serializers.BooleanField(required=False)
    multiple_choice_ind = serializers.BooleanField(required=False)
    random_shuffle_ind = serializers.BooleanField(required=False)
    stop_on_answer_ind = serializers.BooleanField(required=False)
    spotify_random_start_ind = serializers.BooleanField(required=False)
    time_limit = serializers.ChoiceField(choices=TimeLimitOptions.choices, required=False)

    class Meta:
        model = FixationSessionSettings
        fields = ('fixation_session_code', 'show_hints_ind', 'multiple_choice_ind', 'random_shuffle_ind',
                    'stop_on_answer_ind', 'spotify_random_start_ind', 'time_limit', 'active_ind', 'created_ts')

