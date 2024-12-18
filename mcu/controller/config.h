#ifndef CONFIG_H
#define CONFIG_H

#include <Servo.h>
#include <dht.h>

// External objects
extern Servo doorServo;
extern dht DHT;

// Door controller variables
extern int pos;
extern int pirSensor;
extern int pirState;
extern int pirVal;
extern int doorServoPin;
extern unsigned long openTime;
extern const unsigned long openDuration;

// Light controller variables
extern const int lightPin;
extern const int ldrPin;
extern int lightState;
extern int ldrVal;

// Alarm controller variables
extern const int echoPin;
extern const int trigPin;
extern long duration;
extern int distance;
extern const int buzzerPin;

// Fan controller variables
extern const int lower_limit;
extern const int upper_limit;
extern const int fanPin;
extern int temState;
extern int temVal;
extern int fanSpeed;
extern int dhtData;
extern int dhtDataPin;

// Device statuses
extern String DOOR_STATUS;
extern String LIGHT_STATUS;
extern String ALARM_STATUS;
extern String FAN_STATUS;
extern String CURRENT_DOOR_STATUS;
extern String CURRENT_FAN_STATUS;
extern String CURRENT_LIGHT_STATUS;

#endif // CONFIG_H