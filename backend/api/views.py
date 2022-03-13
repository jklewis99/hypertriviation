from django.shortcuts import render
from rest_framework import generics, status

from api.db_helper import join_room
from authentication.models import HypertriviationUser
from .forms import FixationQuestionForm
from .serializers import FixationAnswerSerializer, FixationQuestionSerializer, FixationSerializer, FixationSessionSerializer, FixationSessionSettingsSerializer, GetFixationSessionPlayersSerializer, RoomSerializer, CreateRoomSerializer, StartFixationSessionSerializer, UpdateRoomSerializer, UserSerializer
from .models import Fixation, FixationAnswer, FixationQuestion, FixationSession, FixationSessionPlayer, FixationSessionSettings, Room, User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

class GetRoom(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room) > 0:
                data = RoomSerializer(room[0]).data
                data['is_host'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class JoinRoom(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status=status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else:
                room = Room(host=host, guest_can_pause=guest_can_pause,
                            votes_to_skip=votes_to_skip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)

class UserInRoom(APIView):
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)

class LeaveRoom(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            # if the host left the session, delete the room
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)

class UpdateRoom(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get('guest_can_pause')
            votes_to_skip = serializer.data.get('votes_to_skip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guest_can_pause = guest_can_pause
            room.votes_to_skip = votes_to_skip
            room.save(update_fields=['guest_can_pause', 'votes_to_skip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)


class Users(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class Fixations(generics.ListAPIView):
    queryset = Fixation.objects.all()
    serializer_class = FixationSerializer

class CreateFixation(APIView):
    serializer_class = FixationSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        title = request.data.get('title')
        type = request.data.get('type')
        description = request.data.get('description')
        img_url = request.data.get('img_url')
        settings = request.data.get('settings')
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():

            fixation = Fixation()
            fixation.save();
            return Response(FixationSerializer(fixation).data, status=status.HTTP_201_CREATED)               

        return Response({'Bad Request': 'Request data is in valid'}, status=status.HTTP_400_BAD_REQUEST)

class GetFixation(APIView):
    serializer_class = FixationSerializer
    def get(self, request, fixation_id=None, format=None, *args, **kwargs):
        print(fixation_id)
        if fixation_id != None:
            fixation = Fixation.objects.filter(id=fixation_id)
            if fixation.exists():
                data = FixationSerializer(fixation[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Game Instance Not Found': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Id paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class GetFixationQuestion(APIView):
    serializer_class = FixationQuestionSerializer
    def get(self, request, format=None, *args, **kwargs):
        if request.question_id != None:
            fixation_question = FixationQuestion.objects.filter(id=request.question_id)
            if fixation_question.exists():
                data = FixationQuestionSerializer(fixation_question[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Question Instance Not Found': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Id paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, format=None):
        # request.data.get('title')
        form = FixationQuestionForm(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            fixation_question = FixationQuestion(
                fixation=form.cleaned_data.get("fixation"),
                question_idx=form.cleaned_data.get("question_idx"),
                question_txt=form.cleaned_data.get("question_txt"),
                multiple_choice_ind=form.cleaned_data.get("multiple_choice_ind"),
                img_url=form.cleaned_data.get("img_url"),
                video_playback_url=form.cleaned_data.get("video_playback_url"),
                created_by=form.cleaned_data.get("created_by"),
                question_category=form.cleaned_data.get("question_category")
            ) # TODO: pass settings
            fixation_question.save()
            return Response({f'Question created for {form.cleaned_data.get("fixation")}'}, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': form.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetFixationAnswers(APIView):
    serializer_class = FixationAnswerSerializer
    def get(self, request, question_id=None, format=None, *args, **kwargs):
        if question_id != None:
            question = FixationQuestion.objects.filter(id=question_id)
            if question.exists():
                data = FixationAnswerSerializer(FixationAnswer.objects.filter(question=question[0]), many=True).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Answers Not Found': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Question Id paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class StartFixationSession(APIView):
    serializer_class = StartFixationSessionSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        fixation_id = request.data.get('fixation_id')
        user_id = request.data.get('user_id')
        if serializer.is_valid():
            host = self.request.session.session_key
            fixation_session = FixationSession.objects.filter(host=host)
            fixation_referenced = Fixation.objects.filter(id=fixation_id)
            hosted_by = HypertriviationUser.objects.filter(id=user_id)
            print(fixation_id)
            if fixation_session.exists():
                fixation_session = fixation_session[0]
                # fixation_session.save(update_fields=[]) # TODO: update settings
                # self.request.session['room_code'] = fixation_session.code
                return Response(FixationSessionSerializer(fixation_session).data, status=status.HTTP_200_OK)
            elif fixation_referenced.exists() and hosted_by.exists():
                fixation_referenced = fixation_referenced[0]
                hosted_by = hosted_by[0]
                fixation_session = FixationSession(host=host, hosted_by=hosted_by, fixation=fixation_referenced) # TODO: pass settings
                fixation_session.save()
                return Response(FixationSessionSerializer(fixation_session).data, status=status.HTTP_201_CREATED)
            else:
                return Response({'Bad Request': 'Invalid value for fixation_id'}, status=status.HTTP_400_BAD_REQUEST)
                

        return Response({'Bad Request': 'Request data is in valid'}, status=status.HTTP_400_BAD_REQUEST)

class GetFixationSessionSettings(APIView):
    """
    api_endpoint: get-fixation?code=
    """
    serializer_class = FixationSessionSettingsSerializer
    def get(self, request, format=None, *args, **kwargs):
        code = request.GET.get('code', None)
        if code != None:
            fixation_session_settings = FixationSessionSettings.objects.filter(code=code)
            if fixation_session_settings.exists():
                data = self.serializer_class(fixation_session_settings[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Fixation session not Found': 'No active fixation session with code \'code\''},
                            status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'code not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class SetFixationSessionSettings(APIView):
    """
    api_endpoint: get-fixation?code=
    """
    serializer_class = FixationSessionSettingsSerializer
    def post(self, request, format=None, *args, **kwargs):
        code = request.data.get('fixation_session_code')
        if code != None:
            fixation_session = FixationSession.objects.filter(code=code)
            if fixation_session.exists():
                fixation_session = fixation_session[0]
                fixation_session_settings = FixationSessionSettings.objects.filter(fixation_session=fixation_session)
                show_hints_ind = request.data.get('show_hints_ind')
                multiple_choice_ind = request.data.get('multiple_choice_ind')
                random_shuffle_ind = request.data.get('random_shuffle_ind')
                stop_on_answer_ind = request.data.get('stop_on_answer_ind')
                time_limit = request.data.get('time_limit')
                if fixation_session_settings.exists():
                    # update
                    fixation_session_settings.update(show_hints_ind=show_hints_ind,
                                                    multiple_choice_ind=multiple_choice_ind,
                                                    random_shuffle_ind=random_shuffle_ind,
                                                    stop_on_answer_ind=stop_on_answer_ind,
                                                    time_limit=time_limit)
                    data = FixationSessionSettingsSerializer(fixation_session_settings.refresh_from_db()).data
                    return Response(data, status=status.HTTP_200_OK)
                # otherwise save
                fixation_session_settings = FixationSessionSettings(
                                                    fixation_session=fixation_session,
                                                    show_hints_ind=show_hints_ind,
                                                    multiple_choice_ind=multiple_choice_ind,
                                                    random_shuffle_ind=random_shuffle_ind,
                                                    stop_on_answer_ind=stop_on_answer_ind,
                                                    time_limit=time_limit)
                fixation_session_settings.save()
                return Response(FixationSessionSettingsSerializer(fixation_session_settings).data, status=status.HTTP_201_CREATED)
            return Response({'Fixation session not Found': 'No active fixation session with code \'code\''},
                            status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'code not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class GetFixationSessionPlayers(APIView):
    serializer_class = GetFixationSessionPlayersSerializer
    def get(self, request, format=None, *args, **kwargs):
        code = request.GET.get('code', None)
        if code != None:
            fixation_session = FixationSession.objects.filter(code=code)
            if fixation_session.exists():
                fixation_session = fixation_session[0]
                users = FixationSessionPlayer.objects.filter(fixation_session=fixation_session)
                if users.exists():
                    print(users)
                    data = GetFixationSessionPlayersSerializer(users, many=True).data
                    return Response(data, status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({'Fixation Session Not Found': 'Invalid code.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': '"code" parameter is missing from query string'}, status=status.HTTP_400_BAD_REQUEST)

class JoinFixationSession(APIView):

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        # get from query string
        code = request.GET.get('code', None)

        # get from body
        display_name = request.data.get('display_name')
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        if code != None:
            user_joined_successfully = join_room(display_name, code)
            if user_joined_successfully[0]:
                return Response(
                    {'Success': f'{user_joined_successfully[1]} {code}!'},
                    status=status.HTTP_200_OK
                )

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)

