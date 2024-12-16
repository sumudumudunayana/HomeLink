from home_link.enum import DoorCommands, AlarmCommands, FanCommands, LightCommands
from django.core.cache import cache


class DeviceManager:
    def __init__(self):
        self._door = DoorCommands.AUTO.value
        self._light = LightCommands.AUTO.value
        self._alarm = AlarmCommands.MANUAL_OFF.value
        self._fan = FanCommands.AUTO.value
        self._cmd_stack = []

    @property
    def alarm(self):
        return self._alarm

    @alarm.setter
    def alarm(self, value: AlarmCommands):
        self._alarm = value

    @property
    def door(self):
        return self._door

    @door.setter
    def door(self, value: DoorCommands):
        self._door = value

    @property
    def fan(self):
        return self._fan

    @fan.setter
    def fan(self, value: FanCommands):
        self._fan = value

    @property
    def light(self):
        return self._light

    @light.setter
    def light(self, value: LightCommands):
        self._light = value

    @property
    def cmd_stack(self):
        return self._cmd_stack

    @cmd_stack.setter
    def cmd_stack(self, value: str):
        if value and value not in self._cmd_stack:
            device = value.split("_")[0]
            self._cmd_stack = [cmd for cmd in self._cmd_stack if device not in cmd]
            self._cmd_stack.append(value)
        cache.set("cmd_stack", self._cmd_stack)
        self._cmd_stack = []
