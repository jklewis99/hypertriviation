from django.urls import path
from django.conf.urls import url

from .views import *

urlpatterns = [
    path('fixations', Fixations.as_view()),
    path('fixations/create', JoinRoom.as_view()),
    path('fixations/<int:fixation_id>', GetFixation.as_view()),
    path('fixations/start-session', StartFixationSession.as_view()),
    path('fixations/get-settings', GetFixationSessionSettings.as_view()),
    path('fixations/set-settings', SetFixationSessionSettings.as_view()),
    path('fixations/get-players', GetFixationSessionPlayers.as_view()),
    path('fixations/join', JoinRoom.as_view()),
]