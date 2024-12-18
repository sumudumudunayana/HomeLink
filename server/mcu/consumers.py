import json
import asyncio
import logging

from django.core.cache import cache
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from home_link import device_manager


COMMANDS = [
    "door_open",
    "door_closed",
    "light_on",
    "light_off",
    "fan_on",
    "fan_off",
    "alarm_on",
    "alarm_off",
]
logger = logging.getLogger(__name__)


class ESP32Consumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.loop_running = False
        super().__init__(*args, **kwargs)

    async def connect(self):
        self.event_group_name = "esp_32_event_group"
        await self.channel_layer.group_add(self.event_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        current_statuses = []
        try:
            data = json.loads(text_data)
            cmd = data.get("cmd")
            cmd_data = json.loads(cmd)
            current_statuses.append(cmd_data.get("current_door"))
            current_statuses.append(cmd_data.get("current_fan"))
            current_statuses.append(cmd_data.get("current_alarm"))
            current_statuses.append(cmd_data.get("current_light"))

            # Run the loop every 5 seconds
            channel_layer = get_channel_layer()
            if not self.loop_running or cache.get("cmd_stack"):
                self.loop_running = True
                asyncio.create_task(
                    self.run_every_2_seconds(channel_layer, current_statuses)
                )
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

        except json.JSONDecodeError as e:
            print(f"ERROR: failed to get device status, exception: {e}")

    async def run_every_2_seconds(self, channel_layer, current_statuses):
        task = asyncio.create_task(
            self.process_statuses(current_statuses, channel_layer)
        )
        await task
        await asyncio.sleep(2)
        self.loop_running = False

    async def process_statuses(self, current_statuses, channel_layer):
        for status in current_statuses:
            if status and status in COMMANDS:
                print(f"command received from esp32: {status}")
                await channel_layer.group_send(
                    "next_client_event_group",
                    {
                        "type": "send_message_to_frontend",
                        "status": status,
                    },
                )

    async def send_commands_to_esp_32(self, event):
        print("sending event to esp 32")
        cmd = event.get("status")
        await self.send(text_data=json.dumps({"status": cmd}))
