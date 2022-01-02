from .models import Fixation, FixationSession, FixationSessionPlayer

def join_room(display_name, room_code, player_session_id=None):
    if display_name is None:
        return (False, "Missing 'display_name' in request", None)
    if room_code is None:
        return (False, "Missing 'room_code' in request", None)
    
    fixation_session = FixationSession.objects.filter(code=room_code)
    if fixation_session.exists():
        fixation_session = fixation_session[0]
        fixation_session_user = FixationSessionPlayer.objects.filter(display_name=display_name, fixation_session=fixation_session)
        if fixation_session_user.exists():
            if player_session_id is not None:
                fixation_session_user = FixationSessionPlayer.objects.filter(player_session_id=player_session_id, fixation_session=fixation_session)
                if fixation_session_user.exists():
                    return (True, f"{display_name} successfully rejoined Fixation {room_code}", None)
            # display name taken
            return (False, "display_name taken", None)
        else:
            fixation_session_user = FixationSessionPlayer(
                fixation_session=fixation_session,
                display_name=display_name
            )
            fixation_session_user.save()
            instance = fixation_session_user.get_self()
            return (True, f"{display_name} was successfully added to Fixation {room_code}", instance)
    return (False, "No fixation found for provided room code", None)

def validate_player_exists(display_name: str):
    return FixationSessionPlayer.objects.filter(display_name=display_name).exists()

def validate_fixation_exists(room_code: str):
    return FixationSession.objects.filter(code=room_code).exists()
