import asyncio
import json
from channels.consumer import AsyncConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from random import randint
from time import sleep

from django.conf import settings
from .event_handler import handle_event

class FixationSessionConsumer(AsyncWebsocketConsumer):
    group_name = settings.STREAM_SOCKET_GROUP_NAME

    async def connect(self):
        # Joining group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        # Leave group
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print("receive", text_data)

        # check the type of event
        # event should be the following structure:
        #   {
        #       type: string,
        #       text: JSON string {
        #           event: string,
        #           payload: JSON String    
        #       }
        #   }
        event_json = json.loads(text_data)

        if "message" not in event_json:
            return

        event_json = event_json['message']
        
        if "model" not in event_json:
            return
        
        success, message, payload_to_emit = handle_event(event_json)
        print("\n")
        print(success)
        print(message)
        print(payload_to_emit)
        print("\n")

        await self.channel_layer.group_send(
            self.group_name,
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
        # await self.channel_layer.group_send(
        #     self.group_name,
        #     {
        #         'type': 'system_load',
        #         'data': {
        #             'cpu_percent': 0,  # initial value for cpu and ram set to 0
        #             'ram_percent': 0
        #         }
        #     }
        # )
        # Receive data from WebSocket
        # text_data_json = json.loads(text_data)
        # message = text_data_json['message']
        # print(message)
        # # Print message that receive from Websocket

        # # Send data to group
        # await self.channel_layer.group_send(
        #     self.group_name,
        #     {
        #         'type': 'system_load',
        #         'data': {
        #             'cpu_percent': 0,  # initial value for cpu and ram set to 0
        #             'ram_percent': 0
        #         }
        #     }
        # )

    # async def websocket_connect(self, event):
    #     """
    #     Handshake when websocket connects
    #     """
    #     print(event)
    #     await self.send({"type": "websocket.accept",
    #                      })

    #     await self.send({"type":"websocket.send",
    #                      "ohno":0})



    # async def websocket_receive(self, event):
    #     # when messages is received from websocket
    #     print("receive", event)

    #     # check the type of event
    #     #event should be the following structure:
    #     #   {
    #     #       type: string,
    #     #       text: JSON string {
    #     #           event: string,
    #     #           payload: JSON String    
    #     #       }
    #     #   }
    #     event_json = json.loads(event['text'])

    #     if "message" not in event_json:
    #         return

    #     event_json = event_json['message']
        
    #     if "model" not in event_json:
    #         return
        
    #     success, message, payload_to_emit = handle_event(event_json)
    #     print("\n")
    #     print(success)
    #     print(message)
    #     print(payload_to_emit)
    #     print("\n")

    #     await self.send({"type": "websocket.send",
    #                     "text": json.dumps({"event": event_json["model"],
    #                                         "success": success,
    #                                         "message": message,
    #                                         "data": payload_to_emit})
    #                     })




    # async def websocket_disconnect(self, event):
    #     # when websocket disconnects
    #     print("disconnected", event)