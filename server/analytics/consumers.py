import json

from channels.generic.websocket import AsyncWebsocketConsumer


class DoorStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "event"
        self.room_group_name = self.room_name + "_sharif"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        print("TEXT DATA: ", text_data)
        pass

    async def send_message_to_frontend(self, event):
        print("EVENT TRIGERED")
        # Receive message from room group
        message = event["message"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message}))
