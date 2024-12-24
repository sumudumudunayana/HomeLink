void handleDoorManualControl() {
  if (DOOR_STATUS == "door_open_manual") {
    doorServo.write(120);
    CURRENT_DOOR_STATUS = "door_open";
  } else if (DOOR_STATUS == "door_closed_manual") {
    doorServo.write(0);
    CURRENT_DOOR_STATUS = "door_closed";
  }
}

void handleDoorAutoControl() {
  pirVal = digitalRead(pirSensor);
  if (pirVal == HIGH) {
    doorServo.write(120);
    CURRENT_DOOR_STATUS = "door_open";
    openTime = millis();
    if (pirState == LOW) {
      pirState = HIGH;
    }
  } else if (millis() - openTime >= openDuration) {
    doorServo.write(0);
    CURRENT_DOOR_STATUS = "door_closed";
    pirState = LOW;
  }
}

void handleFanManualControl() {
  if (FAN_STATUS == "fan_on_manual") {
    analogWrite(fanPin, 255);
    CURRENT_FAN_STATUS = "fan_on";
  } else if (FAN_STATUS == "fan_off_manual") {
    analogWrite(fanPin, 0);
    CURRENT_FAN_STATUS = "fan_off";
  }
}

void handleFanAutoControl() {
  dhtData = DHT.read11(dhtDataPin);
  temVal = DHT.temperature;
  fanSpeed = map(constrain(temVal, lower_limit, upper_limit), lower_limit, upper_limit, 0, 255);

  if (fanSpeed > 0 && temState == LOW) {
    CURRENT_FAN_STATUS = "fan_on";
    temState = HIGH;
  } else if (fanSpeed == 0 && temState == HIGH) {
    CURRENT_FAN_STATUS = "fan_off";
    temState = LOW;
  }
  analogWrite(fanPin, fanSpeed);
}

void handleLightManualControl() {
  if (LIGHT_STATUS == "light_on_manual") {
    digitalWrite(lightPin, HIGH);
    CURRENT_LIGHT_STATUS = "light_on";
  } else if (LIGHT_STATUS == "light_off_manual") {
    digitalWrite(lightPin, LOW);
    CURRENT_LIGHT_STATUS = "light_off";
  }
}

void handleLightAutoControl() {
  ldrVal = analogRead(ldrPin);
  if (ldrVal <= 300) {
    digitalWrite(lightPin, HIGH);
    CURRENT_LIGHT_STATUS = "light_on";
    lightState = HIGH;
  } else {
    digitalWrite(lightPin, LOW);
    CURRENT_LIGHT_STATUS = "light_off";
    lightState = LOW;
  }
}

void handleAlarmControl() {
  if (ALARM_STATUS == "alarm_on") {
    digitalWrite(buzzerPin, HIGH);
  } else {
    digitalWrite(buzzerPin, LOW);
  }
}