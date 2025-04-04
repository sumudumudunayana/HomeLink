import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

from analytics.routing import websocket_urlpatterns as analytics_websocket_urlpatterns
from mcu.routing import websocket_urlpatterns as mcu_websocket_urlpatterns

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "home_link.settings")
# Initialize Django ASGI application early to ensure the AppRegistry
# is populated before importing code that may import ORM models.
django_asgi_app = get_asgi_application()


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,
        "websocket": AllowedHostsOriginValidator(
            AuthMiddlewareStack(
                URLRouter(analytics_websocket_urlpatterns + mcu_websocket_urlpatterns)
            )
        ),
    }
)
