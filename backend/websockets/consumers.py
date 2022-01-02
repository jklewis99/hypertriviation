import asyncio
import json
from channels.consumer import AsyncConsumer
from random import randint
from time import sleep
from .event_handler import handle_event

class FixationSessionConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        """
        Handshake when websocket connects
        """
        print(event)
        await self.send({"type": "websocket.accept",
                         })

        await self.send({"type":"websocket.send",
                         "ohno":0})



    async def websocket_receive(self, event):
        # when messages is received from websocket
        print("receive", event)

        # check the type of event
        #event should be the following structure:
        #   {
        #       type: string,
        #       text: JSON string {
        #           event: string,
        #           payload: JSON String    
        #       }
        #   }
        event_json = json.loads(event['text'])

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

        await self.send({"type": "websocket.send",
                        "text": json.dumps({"event": event_json["model"],
                                            "success": success,
                                            "message": message,
                                            "data": payload_to_emit})
                        })




    async def websocket_disconnect(self, event):
        # when websocket disconnects
        print("disconnected", event)