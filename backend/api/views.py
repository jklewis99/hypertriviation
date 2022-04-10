import json
from django.shortcuts import render
from django.core.paginator import Paginator
from rest_framework import generics, status

from api.db_helper import join_room
from authentication.models import HypertriviationUser
from .forms import FixationAnswerForm, FixationForm, FixationQuestionForm
from .serializers import FixationAnswerSerializer, FixationQuestionSerializer, FixationSerializer, FixationSessionSerializer, FixationSessionSettingsSerializer, GetFixationSessionPlayersSerializer, StartFixationSessionSerializer, UserSerializer
from .models import Fixation, FixationAnswer, FixationCategory, FixationQuestion, FixationSession, FixationSessionPlayer, FixationSessionSettings, User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse

class Users(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class Fixations(generics.ListAPIView):
    queryset = Fixation.objects.all()
    serializer_class = FixationSerializer

class CreateFixation(APIView):
    serializer_class = FixationSerializer

    def post(self, request, format=None):
        form = FixationForm(json.loads(request.body))
        # print(request.body)
        if form.is_valid():
            print(form.cleaned_data)
            fixation = Fixation(
                created_by = form.cleaned_data.get("created_by"),
                fixation_title = form.cleaned_data.get("fixation_title"),
                category = form.cleaned_data.get("category") or FixationCategory.OTHER,
                description = form.cleaned_data.get("description"),
                img_url = form.cleaned_data.get("img_url"),
                keep_shuffled = form.cleaned_data.get("keep_shuffled"),
                spotify_playlist_id = form.cleaned_data.get("spotify_playlist_id"),
                spotify_random_start_ind = form.cleaned_data.get("spotify_random_start_ind"),
                default_duration = form.cleaned_data.get("default_duration") or 10
            )
            fixation.save();
            return Response(FixationSerializer(fixation).data, status=status.HTTP_201_CREATED)               

        return Response({'Bad Request': form.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetFixation(APIView):
    serializer_class = FixationSerializer
    def get(self, request, fixation_id=None, format=None, *args, **kwargs):
        if fixation_id != None:
            fixation = Fixation.objects.filter(id=fixation_id)
            if fixation.exists():
                data = FixationSerializer(fixation[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Game Instance Not Found': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Id paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)

class FixationQuestionView(APIView):
    serializer_class = FixationQuestionSerializer
    def get(self, request, format=None, *args, **kwargs):
        question_id = request.GET.get('question_id');
        if question_id != None:
            fixation_question = FixationQuestion.objects.filter(id=question_id)
            if fixation_question.exists():
                data = FixationQuestionSerializer(fixation_question[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'Question Instance Not Found': 'Invalid id.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Id paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request, format=None):
        # request.data.get('title')
        form = FixationQuestionForm(json.loads(request.body))
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
            data = FixationQuestionSerializer(fixation_question).data;
            return Response(data, status=status.HTTP_201_CREATED)
        
        return Response({'Bad Request': form.errors}, status=status.HTTP_400_BAD_REQUEST)

class GetFixationQuestionsAndAnswers(APIView):
    # serializer_class = FixationQuestionSerializer
    def get(self, request, format=None, *args, **kwargs):
        fixation_id = request.GET.get('fixation_id', None)
        # question_idx = request.GET.get('question_idx', None)
        page_number = request.GET.get('page', None)
        if fixation_id and page_number:
            fixation_session = Fixation.objects.filter(id=fixation_id)
            if fixation_session.exists():
                question_list = FixationQuestionSerializer(FixationQuestion.objects.filter(fixation=fixation_session[0]), many=True).data
                # paginator = Paginator(question_list, 10) # return only 10 contacts
                # page_obj = paginator.get_page(page_number)
                # question_list = [FixationQuestionSerializer(page_question).data for page_question in page_obj]
                answers_list = []
                question_and_answers_list = []
                for question in question_list:
                    answers = FixationAnswerSerializer(FixationAnswer.objects.filter(question=FixationQuestion(question['id'])), many=True).data
                    question_and_answers_list.append({
                        "question": question,
                        "answers": answers
                    })
                    # answers_list.extend(FixationAnswerSerializer(FixationAnswer.objects.filter(question=FixationQuestion(question['id'])), many=True).data)
                # fixation_question = FixationQuestion.objects.filter(fixation=fixation_session[0])
                # data = FixationQuestionSerializer(fixation_question[0]).data
                return Response(question_and_answers_list, status=status.HTTP_200_OK)
            return Response({'Fixation Not Found': 'Invalid fixation_id.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'Missing parameters in request'}, status=status.HTTP_400_BAD_REQUEST)

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

class AddFixationAnswers(APIView):
    def post(self, request, format=None):
        # request.data.get('title')
        # print(request.body)
        # print(request.body.getlist('answers'))
        answers_json = json.loads(request.body)
        batch = []
        question_txt = ""
        for item in answers_json["answers"]:
            form = FixationAnswerForm(item)
            if form.is_valid():
                question_txt = form.cleaned_data.get("question")
                fixation_answer = FixationAnswer(
                    question = form.cleaned_data.get("question"),
                    answer_txt = form.cleaned_data.get("answer_txt"),
                    correct_answer_ind = form.cleaned_data.get("correct_answer_ind"),
                    created_by = form.cleaned_data.get("created_by")
                )
                batch.append(fixation_answer)
            else:
                batch = []
                break
        if batch:
            FixationAnswer.objects.bulk_create(batch)
            return Response({f'Answers created for {question_txt}'}, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': form.errors}, status=status.HTTP_400_BAD_REQUEST)

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
        serializer = self.serializer_class(data=request.data)
        if (serializer.is_valid()):
            existing_instance = FixationSessionSettings.objects.filter(fixation_session=serializer.validated_data["fixation_session"])
            if existing_instance.exists():
                serializer.update(existing_instance[0], serializer.validated_data)
                return Response(self.serializer_class(existing_instance[0]).data, status=status.HTTP_200_OK)
            instance = serializer.save()
            return Response(FixationSessionSettingsSerializer(instance).data, status=status.HTTP_201_CREATED)
        return Response({'Bad Request': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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

