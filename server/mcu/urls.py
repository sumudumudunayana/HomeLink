from .views import ReceiveESP32Data, TransmitESP32Data
from django.urls import path

urlpatterns = [
    path("mcu/data/receive", ReceiveESP32Data.as_view()),
    path("mcu/data/transmit", TransmitESP32Data.as_view()),
]
