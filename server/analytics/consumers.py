import json
import logging

from channels.generic.websocket import AsyncWebsocketConsumer
from home_link import device_manager

from home_link.enum import DoorCommands, LightCommands, FanCommands, AlarmCommands

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

        if DoorCommands.is_in_commands(cmd):
            device_manager.door = cmd
        if FanCommands.is_in_commands(cmd):
            device_manager.fan = cmd
        if LightCommands.is_in_commands(cmd):
            device_manager.light = cmd
        if AlarmCommands.is_in_commands(cmd):
            device_manager.alarm = cmd

    async def send_message_to_frontend(self, event):
        print("sending event to client")
        status = event.get("status")
        await self.send(text_data=json.dumps({"status": status}))
