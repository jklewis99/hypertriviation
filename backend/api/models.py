from django.db import models
import string
import random
import uuid
import math

def generate_unique_code(length=8):

    while True:
        code = ''.join(random.choices(string.ascii_uppercase, k=length))
        if FixationSession.objects.filter(code=code).count() == 0:
            break

    return code

class FixationCategory(models.TextChoices):
    OTHER = "Other"
    MUSIC = "Music"

class TimeLimitOptions(models.IntegerChoices):
    FAST = 30
    MODERATE = 60
    SLOW = 120
    UNLIMITED = 1e6

class Room(models.Model):
    code = models.CharField(
        max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=50, unique=True)
    guest_can_pause = models.BooleanField(null=False, default=False)
    votes_to_skip = models.IntegerField(null=False, default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=50, null=True)
    
    def __str__(self):
        return self.code

class User(models.Model):
    """
    Stores a single user entry, containing publicly accessible information
    """
    username = models.CharField(max_length=32, unique=True)
    first_name = models.CharField(max_length=32)
    last_name = models.CharField(max_length=32)
    spotify_authenticated_ind = models.BooleanField(null=False, default=False)
    email = models.CharField(max_length=64)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.username

class Fixation(models.Model):
    """
    Stores a single fixation entry, which defines the trivia session
    """
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    fixation_title = models.CharField(max_length=50, unique=False)
    category = models.TextField(choices=FixationCategory.choices, default=FixationCategory.OTHER)
    description = models.CharField(max_length=240, null=True)
    img_url = models.CharField(max_length=1000, null=True) # change this
    rating = models.FloatField(null=False, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    # TODO: add description

    def __str__(self):
        return self.fixation_title

class FixationSession(models.Model):
    """
    Stores a single fixation session entry, which continas the real time metadata for a trivia session
    """
    code = models.CharField(
        max_length=8, default=generate_unique_code, unique=True)
    host = models.CharField(max_length=64, unique=True)
    hosted_by = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    fixation = models.ForeignKey(Fixation, null=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    current_song = models.CharField(max_length=64, null=True)
    # TODO: add settings (time limit, hints, etc.)
    
    def __str__(self):
        return self.code

class FixationSessionPlayer(models.Model):
    """
    Stores a single fixation session user entry, designated by the code of FixationSession
    """
    player_session_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    fixation_session = models.ForeignKey(FixationSession, null=False, on_delete=models.CASCADE)
    display_name = models.CharField(max_length=16)
    active_ind = models.BooleanField(null=False, default=True)
    added_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.display_name + ": " + self.fixation_session.code

    def get_self(self):
        return {
            "player_session_id": str(self.player_session_id),
            "display_name": self.display_name,
            "fixation_session": self.fixation_session.code
        }

class FixationSessionSettings(models.Model):
    """
    Stores a fixation session settings entry, designated by the code of FixationSession
    """
    fixation_session = models.ForeignKey(FixationSession, null=False, on_delete=models.CASCADE)
    show_hints_ind = models.BooleanField(null=False, default=True)
    multiple_choice_ind = models.BooleanField(null=False, default=True)
    random_shuffle_ind = models.BooleanField(null=False, default=True)
    stop_on_answer_ind = models.BooleanField(null=False, default=False)
    time_limit = models.IntegerField(choices=TimeLimitOptions.choices, default=TimeLimitOptions.UNLIMITED)
    active_ind = models.BooleanField(null=False, default=True)
    created_ts = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.fixation_session.code
