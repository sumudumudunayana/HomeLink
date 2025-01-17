void setup()
{
  doorServo.attach(doorServoPin);
  pinMode(pirSensor, INPUT);

  pinMode(lightPin, OUTPUT);
  pinMode(ldrPin, INPUT);

  pinMode(buzzerPin, OUTPUT);

  pinMode(fanPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  
  digitalWrite(dirPin, HIGH);

  dht.begin();
  Serial.begin(9600);
}