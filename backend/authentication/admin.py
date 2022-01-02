from django.contrib import admin

from .models import HypertriviationUser

class HypertriviationUserAdmin(admin.ModelAdmin):
    model = HypertriviationUser


# Register your models here.
admin.site.register(HypertriviationUser, HypertriviationUserAdmin)