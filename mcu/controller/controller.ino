#include <ArduinoJson.h>
#include "config.h"

void loop() {
  const size_t CAPACITY = JSON_OBJECT_SIZE(1024);
  StaticJsonDocument<CAPACITY> doc;
  JsonObject object = doc.to<JsonObject>();
  String payload;

  String cmdStr = Serial.readString();
  if (cmdStr.length() != 0) {
    parseCommand(cmdStr);
  }

  // Handle controls based on statuses
  if (DOOR_STATUS == "door_operate_auto") handleDoorAutoControl();
  else handleDoorManualControl();

  if (FAN_STATUS == "fan_operate_auto") handleFanAutoControl();
  else handleFanManualControl();

  if (LIGHT_STATUS == "light_operate_auto") handleLightAutoControl();
  else handleLightManualControl();

  handleAlarmControl();

  // Update JSON payload
  object["door"] = DOOR_STATUS;
  object["light"] = LIGHT_STATUS;
  object["alarm"] = ALARM_STATUS;
  object["fan"] = FAN_STATUS;
  object["current_door"] = CURRENT_DOOR_STATUS;
  object["current_alarm"] = ALARM_STATUS;
  object["current_fan"] = CURRENT_FAN_STATUS;
  object["current_light"] = CURRENT_LIGHT_STATUS;

  serializeJson(doc, payload);
  Serial.println(payload);
  delay(200);
}