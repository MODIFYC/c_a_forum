
int led = 8;

// the setup routine runs once when you press reset:
void setup()
{
  Serial.begin(9600);
  pinMode(led, OUTPUT);
}

// the loop routine runs over and over again forever:
void loop()
{
  // node js에서 보낸 값
  int incomingValue = 0;

  if (Serial.available() > 0)
  { // 뭔가 입력값이 있다면
    incomingValue = Serial.read();
    Serial.print("Received value: ");
    Serial.println(incomingValue);
  }

  if (incomingValue == 49)
  {                          // 값이 '1' 이면
    digitalWrite(led, HIGH); // LED를 켠다.
  }

  if (incomingValue == 48)
  {                         // 값이 '0' 이면
    digitalWrite(led, LOW); // LED를 끈다.
  }
}