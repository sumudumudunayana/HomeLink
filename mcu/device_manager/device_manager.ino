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

// Alarm controller variables
#define echoPin 6
#define trigPin 8

long duration;
int distance;

const int buzzerPin = 10;

String DOOR_STATUS = "AUTO";
String LIGHT_STATUS = "AUTO";
String ALARM_STATUS = "OFF";

void setup() {
  doorServo.attach(doorServoPin);
  pinMode(pirSensor, INPUT);

  pinMode(lightPin, OUTPUT);
  pinMode(ldrPin, INPUT);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
  pinMode(buzzerPin, OUTPUT);

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

    if (cmdStr
        == "alarm_on") {
      ALARM_STATUS = "ON";
    }
    if (cmdStr
        == "alarm_off") {
      ALARM_STATUS = "OFF";
    }
  }

  if (DOOR_STATUS == "AUTO") {
    pirVal = digitalRead(pirSensor);
  }
  if (LIGHT_STATUS == "AUTO") {
    ldrVal = analogRead(ldrPin);
  }

  if (ALARM_STATUS == "ON") {
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
  }else if(ALARM_STATUS == "OFF"){
      digitalWrite(buzzerPin, LOW);
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