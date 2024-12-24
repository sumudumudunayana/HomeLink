from home_link.enum import (
    DoorCommands,
    AlarmCommands,
    FanCommands,
    LightCommands,
    ShieldCommands,
)
from django.core.cache import cache


class DeviceManager:
    def __init__(self):
        cache.set("door", DoorCommands.AUTO.value)
        cache.set("light", LightCommands.AUTO.value)
        cache.set("alarm", AlarmCommands.MANUAL_OFF.value)
        cache.set("fan", FanCommands.AUTO.value)
        cache.set("shield", ShieldCommands.MANUAL_OFF.value)
        cache.set("cmd_stack", [])

    @property
    def shield(self):
        return cache.get("shield")

    @shield.setter
    def shield(self, value: ShieldCommands):
        cache.set("shield", value)

    @property
    def alarm(self):
        return cache.get("alarm")

    @alarm.setter
    def alarm(self, value: AlarmCommands):
        cache.set("alarm", value)

    @property
    def door(self):
        return cache.get("door")

    @door.setter
    def door(self, value: DoorCommands):
        cache.set("door", value)

    @property
    def fan(self):
        return cache.get("fan")

    @fan.setter
    def fan(self, value: FanCommands):
        cache.set("fan", value)

    @property
    def light(self):
        return cache.get("light")

    @light.setter
    def light(self, value: LightCommands):
        cache.set("light", value)

    @property
    def cmd_stack(self):
        return cache.get("cmd_stack")

    @cmd_stack.setter
    def cmd_stack(self, value: str):
        cmd_stack = self.cmd_stack
        if value and value not in cmd_stack:
            device = value.split("_")[0]
            cmd_stack = [cmd for cmd in cmd_stack if device not in cmd]
            cmd_stack.append(value)
            cache.set("cmd_stack", cmd_stack)
