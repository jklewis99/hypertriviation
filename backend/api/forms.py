from django import forms
from django.forms import ModelForm

from authentication.models import HypertriviationUser

from .models import Fixation, FixationAnswer, FixationCategory, FixationQuestion

class FixationForm(forms.Form):
    created_by = forms.ModelChoiceField(HypertriviationUser.objects.all(), required=True)
    fixation_title = forms.CharField(max_length=50, required=True)
    category = forms.ChoiceField(choices=FixationCategory.choices, required=False)
    description = forms.CharField(max_length=240, required=False)
    img_url = forms.CharField(max_length=100, required=False) # change this
    keep_shuffled = forms.BooleanField(required=False)
    spotify_playlist_id = forms.CharField(max_length=12, required=False)
    spotify_random_start_ind = forms.BooleanField(required=False)
    default_duration = forms.IntegerField(required=False)

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
    
    def __init__(self, *args, **kwargs):
        super(FixationForm, self).__init__(*args, **kwargs)

class FixationQuestionForm(forms.Form):

    fixation = forms.ModelChoiceField(Fixation.objects.all())
    question_idx = forms.IntegerField()
    question_txt = forms.CharField(max_length=512)
    multiple_choice_ind = forms.BooleanField(required=False)
    img_url = forms.CharField(max_length=512, required=False)
    video_playback_url = forms.CharField(max_length=512, required=False)
    created_by = forms.ModelChoiceField(HypertriviationUser.objects.all())
    question_category = forms.CharField(max_length=128, required=False)
    class Meta:
        model = FixationQuestion
        fields = (
            'fixation',
            'question_idx', 
            'question_txt',
            'multiple_choice_ind', 
            # 'img_url',
            # 'video_playback_url',
            'created_by',
            # 'question_category',
            'created_at', 
            'updated_at'
        )
    
    def __init__(self, *args, **kwargs):
        super(FixationQuestionForm, self).__init__(*args, **kwargs)

class FixationAnswerForm(forms.Form):
    question = forms.ModelChoiceField(FixationQuestion.objects.all())
    answer_txt = forms.CharField(max_length=512)
    correct_answer_ind = forms.BooleanField(required=False)
    created_by = forms.ModelChoiceField(HypertriviationUser.objects.all())
    
    class Meta:
        model = FixationAnswer
        fields = (
            'question',
            'answer_txt',
            'correct_answer_ind',
            'created_by',
            'created_at', 
            'updated_at'
        )
    
    def __init__(self, *args, **kwargs):
        super(FixationAnswerForm, self).__init__(*args, **kwargs)