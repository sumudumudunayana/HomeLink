import json

from channels.generic.websocket import AsyncWebsocketConsumer
from home_link import component_status
from channels.layers import get_channel_layer


class ESP32Consumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.event_group_name = "esp_32_event_group"
        await self.channel_layer.group_add(self.event_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        cmd = data.get("cmd")
        channel_layer = get_channel_layer()
        if cmd == "door_open":
            component_status.set_door_status(True)
            await channel_layer.group_send(
                "event_sharif",
                {
                    "type": "send_message_to_frontend",
                    "door_status": cmd,
                },
            )
        if cmd == "door_closed":
            component_status.set_door_status(False)
            await channel_layer.group_send(
                "event_sharif",
                {
                    "type": "send_message_to_frontend",
                    "door_status": cmd,
                },
            )

    async def send_commands_to_esp_32(self, event):
        cmd = event.get("door_status")
        await self.send(text_data=json.dumps({"status": cmd}))
