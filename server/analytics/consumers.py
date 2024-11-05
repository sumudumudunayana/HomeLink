import json

from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        self.send(text_data=json.dumps({"message": message}))


class DoorStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        print("DATA: ", text_data)

    async def send_door_status(self, event):
        print("EVENT", event)
        await self.send(
            text_data={
                "type": "door_status",
                "details": "open",
            }
        )
