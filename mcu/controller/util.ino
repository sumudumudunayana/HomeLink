void parseCommand(String cmdStr) {
  cmdStr.trim();
  if (cmdStr == "door_open_manual" || cmdStr == "door_closed_manual" || cmdStr == "door_operate_auto") {
    DOOR_STATUS = cmdStr;
  } else if (cmdStr == "light_on_manual" || cmdStr == "light_off_manual" || cmdStr == "light_operate_auto") {
    LIGHT_STATUS = cmdStr;
  } else if (cmdStr == "alarm_on" || cmdStr == "alarm_off") {
    ALARM_STATUS = cmdStr;
  } else if (cmdStr == "fan_on_manual" || cmdStr == "fan_off_manual" || cmdStr == "fan_operate_auto") {
    FAN_STATUS = cmdStr;
  }
}