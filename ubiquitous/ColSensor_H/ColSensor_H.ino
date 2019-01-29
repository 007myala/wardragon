/*
 * Color Radio - This was our attempt to create a handshake method that would transmit sensor readings
 * when queried.
 */
 
// TCS230 / TCS3200 Color Sensor // E0 to GND
int radioID = 9;

#define S0 8
#define S1 9
#define S2 12
#define S3 11
#define sensorOut 7 // OUT
 
int frequency = 0;
int Red, Green, Blue;
 
void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);
  
  pinMode(S0, OUTPUT);
  pinMode(S1, OUTPUT);
  pinMode(S2, OUTPUT);
  pinMode(S3, OUTPUT);
  pinMode(sensorOut, INPUT);
 
  // Setting frequency-scaling to 20%
  digitalWrite(S0,HIGH);
  digitalWrite(S1,LOW);

  establishContact();
 }
 
void loop() {
  // Setting photodiode filter color
  // S2   S3   Color
  // Low  Low  Red
  // Low  High Blue
  // High Low  Clear (no filter)
  // High High Green
  
  // Setting red filtered photodiodes to be read
  digitalWrite(S2,LOW);
  digitalWrite(S3,LOW);
  // Reading the output frequency
  frequency = pulseIn(sensorOut, LOW);
  //Remaping the value of the frequency to the RGB Model of 0 to 255
  frequency = map(frequency, 25,72,255,0);
  if (frequency < 0) {
    frequency = 0;
  }
  if (frequency > 255) {
    frequency = 255;
  }
  delay(10);
  Red = frequency;
 
  // Setting Green filtered photodiodes to be read
  digitalWrite(S2,HIGH);
  digitalWrite(S3,HIGH);
  // Reading the output frequency
  frequency = pulseIn(sensorOut, LOW);
  //Remaping the value of the frequency to the RGB Model of 0 to 255
  frequency = map(frequency, 30,90,255,0);
  if (frequency < 0) {
    frequency = 0;
  }
  if (frequency > 255) {
    frequency = 255;
  }
  delay(10);
  Green = frequency;
 
  // Setting Blue filtered photodiodes to be read
  digitalWrite(S2,LOW);
  digitalWrite(S3,HIGH);
  // Reading the output frequency
  frequency = pulseIn(sensorOut, LOW);
  //Remaping the value of the frequency to the RGB Model of 0 to 255
  frequency = map(frequency, 25,70,255,0);
  if (frequency < 0) {
    frequency = 0;
  }
  if (frequency > 255) {
    frequency = 255;
  }
  delay(10);
  Blue = frequency;

  // Setting Clear filtered photodiodes to be read
  digitalWrite(S2,HIGH);
  digitalWrite(S3,LOW);
  // Reading the output frequency
  frequency = pulseIn(sensorOut, LOW);
  // Remaping the value of the frequency to the RGB Model of 0 to 255
  frequency = map(frequency, 25, 70, 255, 0);
  //Serial.print(" C=");
  //Serial.println(frequency);
  delay(10);
  
    // Send the values
    if (Serial.available() > 0){
      // read the incoming byte
      int inByte = Serial.read();
      // Read the sensor;
      Serial.print(Red);
      Serial.print(",");
      Serial.print(Green);
      Serial.print(",");
      Serial.println(Blue);
    }

    // Send the values
    if (Serial1.available() > 0){
      // read the incoming byte
      int inByte = Serial.read();
      // Read the sensor;
      Serial1.print(Red);
      Serial1.print(",");
      Serial1.print(Green);
      Serial1.print(",");
      Serial1.println(Blue);
    }
}

void establishContact(){
  while(Serial.available() <= 0){
    Serial.println("hello");
    delay(300);
  }
}

// Code Reference : http://www.robotsforfun.com/webpages/colorsensor.html
