import json
from concurrent.futures import ThreadPoolExecutor

from api.db_helper import *

class EventTypes():
    ROOM_JOIN = "joined"
    ANSWER_QUESTION = "answer"



def handle_event(event: dict):
    """
    sends the event to the correct function based on the event name

    Parameters
    ==========
    `event`
        contains keys `model` and `payload`

    Returns
    =========
    (success: bool, message: str, payload_to_emit: dict)
    """
    model = None
    payload = None
    print(event)
    if "model" in event:
        model = event["model"]
    if "payload" in event:
        payload = event["payload"]
    
    # fake case statement
    print(EventTypes.ROOM_JOIN)
    print(model)
    if (model == EventTypes.ROOM_JOIN):
        return handle_join_room(payload)
    elif (model == EventTypes.ANSWER_QUESTION):
        return handle_answer_question(payload)
    
    return (False, "Unsupported event type", None)

def handle_join_room(payload: dict):
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

    if "display_name" in payload:
        display_name = payload["display_name"]
    if "room_code" in payload:
        room_code = payload["room_code"]
    if "player_session_id" in payload:
        player_session_id = payload["player_session_id"]
    if "question_id" in payload:
        question_id = payload["question_id"]

    if validate_player_exists(display_name) and validate_fixation_exists(room_code) and question_id is not None:
        return (True, f"{display_name} answered question {question_id}", payload)
    return (False,
            f"Error: one of the following occurred:" +
            "\n-display_name could not be found," +
            "\n-room_code could not be found" +
            "\n-question_id was not provided", 
            payload)


