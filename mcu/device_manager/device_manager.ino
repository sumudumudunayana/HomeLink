#include <ArduinoJson.h>
#include <Servo.h>
#include <dht.h>

Servo doorServo;

// Door controller variables
int pos = 0;
int pirSensor = 2;
int pirState = LOW;
int pirVal = 0;
int doorServoPin = 9;
unsigned long openTime = 0;
const unsigned long openDuration = 30000;


// Ligth controller variables
const int lightPin = 4;
const int ldrPin = A0;
int lightState = LOW;
int ldrVal = LOW;

// Alarm controller variables
#define echoPin 6
#define trigPin 8

long duration;
int distance;

const int buzzerPin = 10;

// Fan controller variables
#define dhtDataPin 13
const int lower_limit = 25;
const int upper_limit = 35;

const int fanPin = 3;
int temState = LOW;
int temVal = 0;
int fanSpeed = 0;
int dhtData;

dht DHT;

String DOOR_STATUS = "door_operate_auto";
String LIGHT_STATUS = "light_operate_auto";
String ALARM_STATUS = "alarm_off";
String FAN_STATUS = "fan_operate_auto";

String CURRENT_DOOR_STATUS = "door_closed";
String CURRENT_FAN_STATUS = "fan_off";
String CURRENT_LIGHT_STATUS = "light_off";

void setup() {
  doorServo.attach(doorServoPin);
  pinMode(pirSensor, INPUT);

  pinMode(lightPin, OUTPUT);
  pinMode(ldrPin, INPUT);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

  pinMode(fanPin, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  const size_t CAPACITY = JSON_OBJECT_SIZE(1024);
  StaticJsonDocument<CAPACITY> doc;

  JsonObject object = doc.to<JsonObject>();
  String payload;

  String cmdStr = Serial.readString();
  if (cmdStr.length() != 0) {
    cmdStr.trim();
    if (cmdStr
        == "door_open_manual") {
      DOOR_STATUS = cmdStr;
      pirVal = HIGH;
    }
    if (cmdStr
        == "door_closed_manual") {
      DOOR_STATUS = cmdStr;
      pirVal = LOW;
    }
    if (cmdStr
        == "door_operate_auto") {
      DOOR_STATUS = cmdStr;
    }

    if (cmdStr
        == "light_on_manual") {
      LIGHT_STATUS = cmdStr;
      ldrVal = 200;
    }
    if (cmdStr
        == "light_off_manual") {
      LIGHT_STATUS = cmdStr;
      ldrVal = 400;
    }
    if (cmdStr
        == "light_operate_auto") {
      LIGHT_STATUS = cmdStr;
    }

    if (cmdStr
        == "alarm_on") {
      ALARM_STATUS = cmdStr;
    }
    if (cmdStr
        == "alarm_off") {
      ALARM_STATUS = cmdStr;
    }

    if (cmdStr
        == "fan_on_manual") {
      FAN_STATUS = cmdStr;
      fanSpeed = 255;
    }
    if (cmdStr
        == "fan_off_manual") {
      FAN_STATUS = cmdStr;
      fanSpeed = 0;
    }
    if (cmdStr
        == "fan_operate_auto") {
      FAN_STATUS = cmdStr;
    }
  }

  if (DOOR_STATUS == "door_operate_auto") {
    pirVal = digitalRead(pirSensor);
  }
  if (LIGHT_STATUS == "light_operate_auto") {
    ldrVal = analogRead(ldrPin);
  }
  if (FAN_STATUS == "fan_operate_auto") {
    dhtData = DHT.read11(dhtDataPin);
    temVal = DHT.temperature;
    fanSpeed = map(constrain(temVal, lower_limit, upper_limit), lower_limit, upper_limit, 0, 255);
    if (fanSpeed > 0) {
      if (temState == LOW) {
        CURRENT_FAN_STATUS = "fan_on";
        temState = HIGH;
      }
    } else {
      if (temState == HIGH) {
        CURRENT_FAN_STATUS = "fan_off";
        temState = LOW;
      }
    }
  }
  analogWrite(fanPin, fanSpeed);

  if (ALARM_STATUS == "alarm_on") {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);

    digitalWrite(
      trigPin,
      HIGH);
    delayMicroseconds(
      10);

    digitalWrite(trigPin,
                 LOW);
    duration = pulseIn(echoPin, HIGH);
    distance = duration * 0.0344 / 2;
    if (distance < 20) {
      digitalWrite(buzzerPin, HIGH);
    } else {
      digitalWrite(buzzerPin, LOW);
    }
  } else if (ALARM_STATUS == "alarm_off") {
    digitalWrite(buzzerPin, LOW);
  }

  if (ldrVal <= 300) {
    digitalWrite(lightPin, HIGH);
    if (lightState == LOW) {
      CURRENT_LIGHT_STATUS = "light_on";
      lightState = HIGH;
    }
  } else {
    digitalWrite(lightPin, LOW);
    if (lightState == HIGH) {
       CURRENT_LIGHT_STATUS = "light_off";
      lightState = LOW;
    }
  }

  if (pirVal == HIGH) {
    doorServo.write(120);
    if (pirState == LOW) {
      CURRENT_DOOR_STATUS = "door_open";
      pirState = HIGH;
      openTime = millis();
    }
  } else {
    if (millis() - openTime < openDuration) {
      // Keep the door open for 5 seconds
      doorServo.write(120);
    }else{
      doorServo.write(0);
      if (pirState == HIGH) {
        CURRENT_DOOR_STATUS = "door_closed";
        pirState = LOW;
      }
    }
  }

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