#include "config.h"

// External objects
Servo doorServo;
DHT dht(dhtDataPin, DHT11);

// Door controller variables
int pos = 0;
int pirSensor = 2;
int pirState = LOW;
int pirVal = 0;
int doorServoPin = 9;
unsigned long openTime = 0;
const unsigned long openDuration = 10000;

// Light controller variables
const int lightPin = 4;
const int ldrPin = 8;
int lightState = LOW;
int ldrVal = LOW;

// Alarm controller variables
long duration = 0;
int distance = 0;
const int buzzerPin = 10;

// Fan controller variables
const int lower_limit = 25;
const int upper_limit = 35;
const int fanPin = 3; 
const int dirPin = 6;
int temState = LOW;
int temVal = 0;
int fanSpeed = 0;
int dhtData = 0;
int dhtDataPin = 13;


// Device statuses
String DOOR_STATUS = "door_operate_auto";
String LIGHT_STATUS = "light_operate_auto";
String ALARM_STATUS = "alarm_off";
String FAN_STATUS = "fan_operate_auto";
String CURRENT_DOOR_STATUS = "door_closed";
String CURRENT_FAN_STATUS = "fan_off";
String CURRENT_LIGHT_STATUS = "light_off";