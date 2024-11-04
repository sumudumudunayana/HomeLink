from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions


class ReceiveESP32Data(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        print("DATA", request.data)
        return Response(
            {"status": "DOOR HAS BEEN OPENED"},
            status=status.HTTP_200_OK,
        )
