from django import forms
from django.forms import ModelForm

from backend.api.models import Fixation, User

class FixationForm(forms.Form):

    class Meta:
        model = Fixation
        fields = ('id', 'created_by', 'fixation_title', 'description', 'category', 'img_url', 'rating', 'created_at')
    
    def __init__(self, *args, **kwargs):
        created_by_name = kwargs.pop('created_by_name','')
        super(FixationForm, self).__init__(*args, **kwargs)
        self.fields['created_by']=forms.ModelChoiceField(queryset=User.objects.filter(username=created_by_name))