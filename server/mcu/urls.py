from .views import ReceiveESP32Data
from django.urls import path

urlpatterns = [path("mcu/data", ReceiveESP32Data.as_view())]
