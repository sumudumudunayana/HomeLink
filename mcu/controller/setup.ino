void setup()
{
  doorServo.attach(doorServoPin);
  pinMode(pirSensor, INPUT);

  pinMode(lightPin, OUTPUT);
  pinMode(ldrPin, INPUT);

  pinMode(buzzerPin, OUTPUT);

  pinMode(fanPin, OUTPUT);

  Serial.begin(9600);
}