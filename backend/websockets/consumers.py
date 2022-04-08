import json
from channels.generic.websocket import AsyncWebsocketConsumer

from django.conf import settings
from .event_handler import handle_event

class FixationSessionConsumer(AsyncWebsocketConsumer):
    group_name = ""
    groups = set([settings.STREAM_SOCKET_GROUP_NAME])

    async def connect(self):
        session_id = self.scope['url_route']['kwargs']['code']
        group_name = f"session_code_{session_id}"
        print("==="*10)
        print("BEFORE CONNECT:", self.group_name)
        print("==="*10)
        self.group_name = group_name
        self.groups.add(group_name)
        print(session_id)
        # Joining group but not actually because this doesn't work
        await self.channel_layer.group_add(
            group_name,
            self.channel_name
        )
        print("==="*10)
        print("AFTER CONNECT:", self.group_name)
        print("==="*10)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        '''
        check the type of event
        event should be the following structure:
          {
              type: string,
              text: JSON string {
                  event: string,
                  group: string,
                  payload: JSON String    
              }
          }
        '''
        session_id = self.scope['url_route']['kwargs']['code']
        group_name = f"session_code_{session_id}"
        event_json = json.loads(text_data)

        if "message" not in event_json:
            return

        event_json = event_json['message']
        
        if "model" not in event_json:
            return
        
        if "group" not in event_json:
            return
        
        print("==="*10)
        print("SEND MESSAGE:", self.group_name)
        print("==="*10)
        success, message, payload_to_emit, _ = handle_event(event_json)
        if session_id and group_name in self.groups:
            await self.channel_layer.group_send(
                group_name,
                {
                    "type": "fixation_event",
                    "data": {
                        "event": event_json["model"],
                        "success": success,
                        "message": message,
                        "data": payload_to_emit
                    }
                })
        
    async def fixation_event(self, event):
        # Receive data from group
        await self.send(text_data=json.dumps(event['data']))
