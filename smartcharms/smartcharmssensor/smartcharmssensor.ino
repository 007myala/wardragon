/* 
 *  Smart Charms - smartcharmssensor.ino
 *  Dev - MARIa deniSE Yala
 *  
 *  Smart Charms is program to collect sensor data
 *  from a handheld stress toy that can be squeezed,
 *  pressed or crushed in one's hand. Sensor values
 *  are passed to a p5 sketch and visualized on screen
 *  to hepl calm the wearer down or distract them from 
 *  their anxieties.
 *  
 *  Last Modified - 01 / 31 / 19
 */
#include <ArduinoJson.h> // Install version 5.13.3

const int sensorPin = A0;
int sensorMax = 1023;
int sensorMin = 0;

void setup() {
  // initialize serial communication
  Serial.begin(9600);
  Serial1.begin(9600);
}

void loop() {
  // read the sensor value on analog pin 0;
  int sensorValue = analogRead(sensorPin);
  // map the values to the range 0 to 1023
  int stressValue = map(sensorValue,sensorMin,sensorMax,0,10);
  Serial1.print("OG Val");
  Serial.print("OG Val");
  Serial1.print(",");
  Serial.print(",");
  Serial1.print(sensorValue);
  Serial.print(sensorValue);
  Serial1.print(",");
  Serial.print(",");
  Serial1.print(" Stress Val");
  Serial.print(" Stress Val");
  Serial1.print(",");
  Serial.print(",");
  Serial1.println(stressValue);
  Serial.println(stressValue);
  delay(2000); // delay in between reads for stability
  
}
