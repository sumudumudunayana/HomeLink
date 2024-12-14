import json
from channels.layers import get_channel_layer
import logging

from channels.generic.websocket import AsyncWebsocketConsumer
from home_link import component_status

logger = logging.getLogger(__name__)


class NextClientConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "next_client_event_group"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        cmd = data.get("cmd")

        channel_layer = get_channel_layer()
        if cmd in [
            "door_open_manual",
            "door_closed_manual",
            "door_operate_auto",
            "light_on_manual",
            "light_off_manual",
            "light_operate_auto",
            "alarm_on",
            "alarm_off",
            "fan_on_manual",
            "fan_off_manual",
            "fan_operate_auto",
        ]:
            print(f"command received from client: {cmd}")
            component_status.set_door_status(True)
            await channel_layer.group_send(
                "esp_32_event_group",
                {
                    "type": "send_commands_to_esp_32",
                    "status": cmd,
                },
            )

    async def send_message_to_frontend(self, event):
        print("sending event to client")
        status = event.get("status")
        await self.send(text_data=json.dumps({"status": status}))
