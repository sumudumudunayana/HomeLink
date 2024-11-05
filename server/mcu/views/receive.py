from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class ReceiveESP32Data(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        cmd = data.get("cmd")
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "event_sharif",
            {
                "type": "send_message_to_frontend",
                "door_status": cmd,
            },
        )

        return Response(
            {"status": "COMMAND EXECUTED SUCCESSFULLY"},
            status=status.HTTP_200_OK,
        )
