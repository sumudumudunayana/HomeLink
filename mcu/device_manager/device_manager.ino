#include <Servo.h>

Servo doorServo;

// Door controller variables
int pos = 0;
int pirSensor = 2;
int pirState = LOW;
int pirVal = 0;
int doorServoPin = 9;


// Ligth controller variables
const int lightPin = 4;
const int ldrPin = A0;
int lightState = LOW;
int ldrVal = LOW;

String DOOR_STATUS = "AUTO";
String LIGHT_STATUS = "AUTO";

void setup() {
  doorServo.attach(doorServoPin);
  pinMode(pirSensor, INPUT);
  pinMode(lightPin, OUTPUT);
  pinMode(ldrPin, INPUT);

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

    if (cmdStr
        == "light_on_manual") {
      LIGHT_STATUS = "MANUAL";
      ldrVal = 200;
    }
    if (cmdStr
        == "light_off_manual") {
      LIGHT_STATUS = "MANUAL";
      ldrVal = 400;
    }
    if (cmdStr
        == "light_operate_auto") {
      LIGHT_STATUS = "AUTO";
    }
  }

  if (DOOR_STATUS == "AUTO") {
    pirVal = digitalRead(pirSensor);
  }
  if (LIGHT_STATUS == "AUTO") {
    ldrVal = analogRead(ldrPin);
  }

  if (ldrVal <= 300) {
    digitalWrite(lightPin, HIGH);
    if (lightState == LOW) {
      Serial.println("light_on");
      lightState = HIGH;
    }
  } else {
    digitalWrite(lightPin, LOW);
    if (lightState == HIGH) {
      Serial.println("light_off");
      lightState = LOW;
    }
  }

  if (pirVal == HIGH) {
    doorServo.write(120);
    if (pirState == LOW) {
      Serial.println("door_open");
      pirState = HIGH;
    }
    delay(100);
  } else {
    doorServo.write(0);
    if (pirState == HIGH) {
      Serial.println("door_closed");
      pirState = LOW;
    }
    delay(100);
  }
}