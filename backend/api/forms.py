from django import forms
from django.forms import ModelForm

from backend.api.models import Fixation, FixationAnswer, User, FixationQuestion

class FixationForm(forms.Form):

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
        created_by_name = kwargs.pop('created_by_name', '')
        super(FixationForm, self).__init__(*args, **kwargs)
        self.fields['created_by'] = forms.ModelChoiceField(queryset=User.objects.filter(username=created_by_name))

class FixationQuestionForm(forms.Form):

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
        fixation_id = kwargs.pop('fixation_id', '')
        super(FixationForm, self).__init__(*args, **kwargs)
        self.fields['fixation'] = forms.ModelChoiceField(queryset=Fixation.objects.filter(id=fixation_id))

class FixationAnswerForm(forms.Form):

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
        fixation_id = kwargs.pop('fixation_id', '')
        super(FixationForm, self).__init__(*args, **kwargs)
        self.fields['fixation'] = forms.ModelChoiceField(queryset=Fixation.objects.filter(id=fixation_id))