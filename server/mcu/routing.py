from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/control/mcu", consumers.ESP32Consumer.as_asgi()),
]
