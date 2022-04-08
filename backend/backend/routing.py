from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator
from websockets.consumers import FixationSessionConsumer
from django.urls import path
# from .wsgi import *

application = ProtocolTypeRouter({
    'websocket': AllowedHostsOriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                path('websockets/<str:code>', FixationSessionConsumer.as_asgi())
            ])
        )
    )
})