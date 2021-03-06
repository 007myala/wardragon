/*
 * Arduino / Xbee - Silent Alarm
 * 
 * Code was created using reference from the following sources
 * http://www.arduino.cc/en/Tutorial/PhysicalPixel 
 * http://www.arduino.cc/en/Tutorial/Sweep
 */

#include <Servo.h>
Servo myservo; // servo object to control a servo

int incomingByte; // read incoming serial data
int pos = 0; // servo position
int radioID = 12;

void setup() {
  // initializee serial communication;
  Serial.begin(9600);
  Serial1.begin(9600);
  // Attach servo on pin 9
  myservo.attach(9);
}

void loop() {
  // read the input on analog pin 0;
  int sensorValue = analogRead(A0);
  Serial1.print(radioID);
  Serial.print(radioID);
  Serial1.print(",");
  Serial.print(",");
  Serial1.println(sensorValue);
  Serial.println(sensorValue);
  delay(200);
  /*
  // See if there is incoing serial data
  if (Serial1.available() > 0){
    // Read the oldest byte in the serial buffer
    incomingByte = Serial1.read();
    // if it's a capital H - rotate servo
    if (incomingByte == 'H'){
      // RUN 5 TIMES
      for (int i = 0; i < 5; i++){
        for (pos = 0; pos <= 180; pos+= 10){
          myservo.write(pos);
          delay(15);
        }
        for (pos = 180; pos >= 0; pos-= 10){
          myservo.write(pos);
          delay(15);
        }
      }
    }
    
    // if it's an L - rotate servo
    if (incomingByte == 'L'){
      for (pos = 180; pos >= 0; pos-= 10){
        myservo.write(pos);
        delay(15);
      }
      for (pos = 0; pos <= 180; pos+= 10){
          myservo.write(pos);
          delay(15);
      }
    }
  }
  */
}
