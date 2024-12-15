import json
import logging

from channels.generic.websocket import AsyncWebsocketConsumer
from home_link import device_manager
from channels.layers import get_channel_layer

COMMANDS = [
    "door_open",
    "door_closed",
    "light_on",
    "light_off",
    "fan_on",
    "fan_off",
]
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
        cmd_data = json.loads(cmd)
        current_cmd = cmd_data.get("cmd")
        if current_cmd and current_cmd in COMMANDS:
            channel_layer = get_channel_layer()
            print(f"command received from esp32: {cmd}")
            await channel_layer.group_send(
                "next_client_event_group",
                {
                    "type": "send_message_to_frontend",
                    "status": current_cmd,
                },
            )
            return
        try:
            door = cmd_data.get("door")
            alarm = cmd_data.get("alarm")
            fan = cmd_data.get("fan")
            light = cmd_data.get("light")

            if door and device_manager.door != door:
                device_manager.cmd_stack = device_manager.door

            if fan and device_manager.fan != fan:
                device_manager.cmd_stack = device_manager.fan

            if light and device_manager.light != light:
                device_manager.cmd_stack = device_manager.light

            if alarm and device_manager.alarm != alarm:
                device_manager.cmd_stack = device_manager.alarm
        except Exception:
            print("ERROR: failed to get device status")

    async def send_commands_to_esp_32(self, event):
        print("sending event to esp 32")
        cmd = event.get("status")
        await self.send(text_data=json.dumps({"status": cmd}))
