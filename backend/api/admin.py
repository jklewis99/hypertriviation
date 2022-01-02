from django.contrib import admin

from .models import Fixation, FixationSession, FixationSessionPlayer, FixationSessionSettings

# Register your models here.
admin.site.register(Fixation)
admin.site.register(FixationSession)
admin.site.register(FixationSessionPlayer)
admin.site.register(FixationSessionSettings)