import json
from concurrent.futures import ThreadPoolExecutor

from api.db_helper import *

class EventTypes():
    SESSION_JOIN = "joined"
    ANSWER_QUESTION = "answer"
    SESSION_STARTED = "session_started"
    SESSION_OPENED = "session_opened"
    SESSION_QUESTION_CHANGE = "session_question_change"
    SESSION_SONG_CHANGE = "session_song_change"
    SESSION_QUESTION_REVEAL_ANSWER = "session_question_reveal_answer"


def handle_event(event: dict):
    """
    sends the event to the correct function based on the event name

    Parameters
    ==========
    `event`
        contains keys `model` and `payload`

    Returns
    =========
    (success: bool, message: str, payload_to_emit: dict, group: str)
    """
    model = None
    payload = None
    if "model" in event:
        model = event["model"]
    if "payload" in event:
        payload = event["payload"]
    if "group" in event:
        group = event["group"]
    else:
        group = None
    
    # fake case statement
    if (model == EventTypes.SESSION_OPENED):
        return (*handle_session_opened(payload), group)
    elif (model == EventTypes.SESSION_JOIN):
        return (*handle_join_session(payload), group)
    elif (model == EventTypes.SESSION_STARTED):
        return (*handle_session_started(payload), group)
    elif (model == EventTypes.SESSION_QUESTION_CHANGE):
        return (*handle_session_question_changed(payload), group)
    elif (model == EventTypes.SESSION_SONG_CHANGE):
        return (*handle_session_question_changed(payload), group)
    elif (model == EventTypes.ANSWER_QUESTION):
        return (*handle_answer_question(payload), group)
    elif (model == EventTypes.SESSION_QUESTION_REVEAL_ANSWER):
        return (*handle_session_question_reveal_answers(payload), group)
    
    return (False, "Unsupported event type", None, None)

def handle_session_opened(payload: dict):
    """
    set session to active

    Parameters
    ==========
    `payload`
        contains keys `fixation_id`, `room_code`, and `host`
        
    Returns
    =========
    (success: bool, message: str, player_payload: dict)
    """
    fixation_id = None
    room_code = None
    host = None

    if "fixation_id" in payload:
        fixation_id = payload["fixation_id"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "multiple_choice_ind" in payload:
        host = payload["host"]
    
    return (True, f"{room_code}: session opened", payload)

def handle_join_session(payload: dict):
    """
    add user to FixationUserSession

    Parameters
    ==========
    `payload`
        contains keys `display_name`, `room_code`, and (optionally) `player_session_id`
        
    Returns
    =========
    (success: bool, message: str, player_payload: dict)
    """
    display_name = None
    room_code = None
    player_session_id = None

    if "display_name" in payload:
        display_name = payload["display_name"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "player_session_id" in payload:
        player_session_id = payload["player_session_id"]

    with ThreadPoolExecutor() as executor:
        thread = executor.submit(join_room, display_name, room_code, player_session_id)
        return thread.result()

def handle_answer_question(payload: dict):
    """
    send answer to the host

    Parameters
    ==========
    `payload`
        contains keys `display_name`, `room_code`, `player_session_id`, and `question_id`

    Returns
    =========
    (success: bool, message: str, answer_payload: dict)
    """
    display_name = None
    room_code = None
    player_session_id = None
    question_id = None
    answer_id = None
    answer_txt = None

    if "display_name" in payload:
        display_name = payload["display_name"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "player_session_id" in payload:
        player_session_id = payload["player_session_id"]
    if "question_id" in payload:
        question_id = payload["question_id"]
    if "answer_id" in payload:
        answer_id = payload["answer_id"]
    if "answer_txt" in payload:
        answer_txt = payload["answer_txt"]

    if validate_player_exists(display_name) and validate_fixation_exists(room_code) and question_id and (answer_id or answer_txt):
        return (True, f"{display_name} answered question {question_id}", payload)
    return (False,
            f"Error: one of the following occurred:" +
            "\n-display_name could not be found," +
            "\n-room_code could not be found" +
            "\n-question_id was not provided" +
            "\n-answer was not provided", 
            payload)

def handle_session_started(payload: dict):
    """
    set session to active

    Parameters
    ==========
    `payload`
        contains keys `fixation_id`, `room_code`, and `session_started`
        
    Returns
    =========
    (success: bool, message: str, player_payload: dict)
    """
    fixation_id = None
    room_code = None
    session_started = None
    multiple_choice_ind = None

    if "fixation_id" in payload:
        fixation_id = payload["fixation_id"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "session_started" in payload:
        session_started = payload["session_started"]
    if "multiple_choice_ind" in payload:
        multiple_choice_ind = payload["multiple_choice_ind"]
    
    # TODO: set fixation session to active
    # with ThreadPoolExecutor() as executor:
    #     thread = executor.submit(join_room, fixation_id, room_code, player_session_id)
    #     return thread.result()
    return (True, f"{room_code}: session {'started' if session_started else 'stopped'}", payload)

def handle_session_question_changed(payload: dict):
    """
    move to next question

    Parameters
    ==========
    `payload`
        contains keys `fixation_id`, `room_code`, `question_txt`, `question_idx`, `answers`
        
    Returns
    =========
    (success: bool, message: str, player_payload: dict)
    """
    fixation_id = None
    room_code = None
    question_txt = None
    question_idx = None
    answers = None

    if "fixation_id" in payload:
        fixation_id = payload["fixation_id"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "question_txt" in payload:
        question_txt = payload["question_txt"]
    if "question_idx" in payload:
        question_idx = payload["question_idx"]
    if "answers" in payload:
        answers = payload["answers"]
    
    
    # TODO: set fixation session to active
    # with ThreadPoolExecutor() as executor:
    #     thread = executor.submit(join_room, fixation_id, room_code, player_session_id)
    #     return thread.result()
    return (True, f"{room_code}: next question to {question_idx}", payload)

def handle_session_song_changed(payload: dict):
    """
    move to next song

    Parameters
    ==========
    `payload`
        contains keys `fixation_id`, `room_code`, `song_name`, `artist_name`
        
    Returns
    =========
    (success: bool, message: str, player_payload: dict)
    """
    fixation_id = None
    room_code = None
    song_name = None
    artist_name = None

    if "fixation_id" in payload:
        fixation_id = payload["fixation_id"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "song_name" in payload:
        song_name = payload["song_name"]
    if "artist_name" in payload:
        artist_name = payload["artist_name"]
    
    
    # TODO: set fixation session to active
    # with ThreadPoolExecutor() as executor:
    #     thread = executor.submit(join_room, fixation_id, room_code, player_session_id)
    #     return thread.result()
    return (True, f"{room_code}: next song to {song_name}", payload)

def handle_session_question_reveal_answers(payload: dict):
    """
    show answers (if show is true)

    Parameters
    ==========
    `payload`
        contains keys `fixation_id`, `room_code`, `question_txt`, `question_idx`, `reveal`
        
    Returns
    =========
    (success: bool, message: str, player_payload: dict)
    """
    fixation_id = None
    room_code = None
    question_txt = None
    question_idx = None
    do_reveal = None

    if "fixation_id" in payload:
        fixation_id = payload["fixation_id"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "question_txt" in payload:
        question_txt = payload["question_txt"]
    if "question_idx" in payload:
        question_idx = payload["question_idx"]
    if "do_reveal" in payload:
        do_reveal = payload["do_reveal"]
    
    
    # TODO: set fixation session to active
    # with ThreadPoolExecutor() as executor:
    #     thread = executor.submit(join_room, fixation_id, room_code, player_session_id)
    #     return thread.result()
    return (True, f"{room_code}: time to end question {question_idx}", payload)
