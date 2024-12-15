import threading
import signal
import time
import sys
import asyncio

from django.core.cache import cache
from django.core.management import BaseCommand
from channels.layers import get_channel_layer


class CommandConsumer:
    def __init__(self, stop_event: threading.Event):
        super().__init__()
        self._stop_event = stop_event

    async def _consume_command_async(self):
        channel_layer = get_channel_layer()
        while not self._stop_event.is_set():
            while True and not self._stop_event.is_set():
                stack = cache.get("cmd_stack")
                if not stack:
                    break
                print(f"Processing current {stack=}")
                cmd = stack.pop()
                cache.set("cmd_stack", stack)
                await channel_layer.group_send(
                    "esp_32_event_group",
                    {
                        "type": "send_commands_to_esp_32",
                        "status": cmd,
                    },
                )
                await asyncio.sleep(1)

    def consume_command(self):
        """Run the async function inside an event loop."""
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(self._consume_command_async())
        finally:
            loop.close()


class Command(BaseCommand):
    def __init__(self):
        super().__init__()
        self._stop_event = threading.Event()

    def handle(self, *args, **kwargs):
        signal.signal(signal.SIGINT, self._signal_handler)
        signal.signal(signal.SIGTERM, self._signal_handler)
        consumer = CommandConsumer(stop_event=self._stop_event)
        thread = threading.Thread(target=consumer.consume_command)
        thread.start()
        while not self._stop_event.is_set():
            time.sleep(1)

        thread.join()

    def _signal_handler(self, signal, frame):
        self._stop_event.set()
        sys.exit(0)
