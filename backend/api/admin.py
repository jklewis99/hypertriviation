from django.contrib import admin

from .models import Fixation, FixationAnswer, FixationQuestion, FixationSession, FixationSessionPlayer, FixationSessionSettings

# Register your models here.
admin.site.register(Fixation)
admin.site.register(FixationQuestion)
admin.site.register(FixationAnswer)
admin.site.register(FixationSession)
admin.site.register(FixationSessionPlayer)
admin.site.register(FixationSessionSettings)