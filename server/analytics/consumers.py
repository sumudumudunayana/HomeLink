import json
from channels.layers import get_channel_layer


from channels.generic.websocket import AsyncWebsocketConsumer
from home_link import component_status


class DoorStatusConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = "event"
        self.room_group_name = self.room_name + "_sharif"
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        cmd = data.get("cmd")
        channel_layer = get_channel_layer()
        if cmd in ["door_open_manual", "door_closed_manual"]:
            component_status.set_door_status(True)
            await channel_layer.group_send(
                "esp_32_event_group",
                {
                    "type": "send_commands_to_esp_32",
                    "door_status": cmd,
                },
            )
        if cmd == "door_open":
            component_status.set_door_status(True)
        if cmd == "door_closed":
            component_status.set_door_status(False)

    async def send_message_to_frontend(self, event):
        status = event["door_status"]
        await self.send(text_data=json.dumps({"status": status}))
