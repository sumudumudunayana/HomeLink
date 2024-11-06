#include <Servo.h>

Servo doorServo;

int pos = 0;
int pirSensor = 2;
int pirState = LOW;
int pirVal = 0;

String DOOR_STATUS = "AUTO";

void setup() {
  doorServo.attach(9);
  pinMode(pirSensor, INPUT);
  Serial.begin(9600);
}

void loop() {
  String cmdStr = Serial.readString();
  if (cmdStr.length() != 0) {
    cmdStr.trim();
    if (cmdStr
        == "door_open_manual") {
      DOOR_STATUS = "MANUAL";
      pirVal = HIGH;
    }
    if (cmdStr
        == "door_closed_manual") {
      DOOR_STATUS = "MANUAL";
      pirVal = LOW;
    }
    if (cmdStr
        == "door_operate_auto") {
      DOOR_STATUS = "AUTO";
    }
  }
  if (DOOR_STATUS == "AUTO") {
    pirVal = digitalRead(pirSensor);
  }
  if (pirVal == HIGH) {
    doorServo.write(120);
    if (pirState == LOW) {
      Serial.println("door_open");
      pirState = HIGH;
    }
    delay(500);
  } else {
    doorServo.write(0);
    delay(100);
    if (pirState == HIGH) {
      Serial.println("door_closed");
      pirState = LOW;
    }
  }
}