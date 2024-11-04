#include <Servo.h>

Servo doorServo;

// int pos = 0;
// int pirSensor = 2;
// int pirState = LOW;
// int pirVal = 0;

void setup() {
  // doorServo.attach(9);
  // pinMode(pirSensor, INPUT);
  Serial.begin(9600);
}

void loop() {
  // pirVal = digitalRead(pirSensor);
  Serial.println("door open");
  delay(1000);
  // if (pirVal == HIGH) {
  //   doorServo.write(120);
  //   if (pirState == LOW) {
  //     Serial.println("door_open");
  //     pirState = HIGH;
  //   }
  //   delay(5000);
  // } else {
  //   doorServo.write(0);
  //   delay(100);
  //   if (pirState == HIGH) {
  //     Serial.println("door_closed!");
  //     pirState = LOW;
  //   }
  // }

}