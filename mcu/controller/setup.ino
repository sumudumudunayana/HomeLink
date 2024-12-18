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