from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from analytics.consumers import DoorStatusConsumer


class ReceiveESP32Data(APIView):
    def __init__(self, **kwargs):
        self.door_consumer = DoorStatusConsumer()
        super().__init__(**kwargs)

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("DATA", request.data)
        data = request.data
        cmd = data.get("cmd")
        if cmd == "door_open":
            msg = "DOOR HAS BEEN OPENED"
        if cmd == "door_closed":
            msg = "DOOR HAS BEEN CLOSED"

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "event_sharif",
            {
                "type": "send_message_to_frontend",
                "message": "event_trigered_from_views",
            },
        )

        return Response(
            {"status": msg},
            status=status.HTTP_200_OK,
        )
