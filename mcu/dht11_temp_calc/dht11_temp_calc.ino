#include <dht.h>
#define outPin 13

const int fanPin = 3;

dht DHT;

void setup(){
  Serial.begin(9600);
}

void loop(){
  int readData = DHT.read11(outPin);
  int t = DHT.temperature;
  Serial.print("Temperature = ");
  Serial.println(t);
  int lower_limit = 25;
  int upper_limit = 35; 
  int speed = map(constrain(x, lower_limit, upper_limit),lower_limit,upper_limit,0,255);
  Serial.print("Speed = ");
  Serial.println(speed);
  analogWrite(fanPin,speed);
  delay(500);
}
