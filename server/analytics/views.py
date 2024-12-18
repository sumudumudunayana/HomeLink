import requests

from django.conf import settings

from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status

KEY = settings.WEATHER_API_KEY

print("KEY", KEY)


class WeatherViewSet(RetrieveAPIView):
    """
    A simple ViewSet for viewing accounts.
    """

    def get(self, request, *args, **kwargs):
        url = "https://api.weatherapi.com/v1/current.json?q=7.264555339533095,80.57059929604941"
        weather_report = requests.get(url=url, headers={"key": KEY}).json()
        return Response({"report": weather_report}, status=status.HTTP_200_OK)
