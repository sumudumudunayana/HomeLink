from django.urls import path

from .views import WeatherViewSet

urlpatterns = [path("weather/report", WeatherViewSet().as_view())]
