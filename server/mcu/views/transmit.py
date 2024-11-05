from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions

from home_link import component_status


class TransmitESP32Data(APIView):
    permission_classes = [permissions.AllowAny]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

    def get(self, request):
        return Response(
            {"status_data": {"door": component_status.get_door_status()}},
            status=status.HTTP_200_OK,
        )
