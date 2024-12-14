import json
import logging

from channels.generic.websocket import AsyncWebsocketConsumer
from home_link import component_status
from channels.layers import get_channel_layer

COMMANDS = ["door_open", "door_closed", "light_on", "light_off", "fan_on", "fan_off"]
logger = logging.getLogger(__name__)


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
        if cmd in COMMANDS:
            print(f"command received from esp32: {cmd}")
            component_status.set_door_status(True)
            await channel_layer.group_send(
                "next_client_event_group",
                {
                    "type": "send_message_to_frontend",
                    "status": cmd,
                },
            )

    async def send_commands_to_esp_32(self, event):
        print("sending event to esp 32")
        cmd = event.get("status")
        await self.send(text_data=json.dumps({"status": cmd}))
