from enum import Enum


class BaseCommand(Enum):
    @classmethod
    def is_in_commands(cls, cmd):
        for command in cls:
            if command.value == cmd:
                return True
        return False


class DoorCommands(BaseCommand):
    MANUAL_OPEN = "door_open_manual"
    MANUAL_CLOSE = "door_closed_manual"
    AUTO = "door_operate_auto"


class LightCommands(BaseCommand):
    MANUAL_ON = "light_on_manual"
    MANUAL_OFF = "light_off_manual"
    AUTO = "light_operate_auto"


class FanCommands(BaseCommand):
    MANUAL_ON = "fan_on_manual"
    MANUAL_OFF = "fan_off_manual"
    AUTO = "fan_operate_auto"


class AlarmCommands(BaseCommand):
    MANUAL_ON = "alarm_on"
    MANUAL_OFF = "alarm_off"


class ShieldCommands(BaseCommand):
    MANUAL_ON = "shield_on"
    MANUAL_OFF = "shield_off"
