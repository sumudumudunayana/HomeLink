from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions


class ReceiveESP32Data(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("DATA", request.data)
        data = request.data
        cmd = data.get("cmd")
        if cmd == "door_open":
            msg = "DOOR HAS BEEN OPENED"
        if cmd == "door_closed":
            msg = "DOOR HAS BEEN CLOSED"
        return Response(
            {"status": msg},
            status=status.HTTP_200_OK,
        )
