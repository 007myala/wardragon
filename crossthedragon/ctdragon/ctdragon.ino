#include <Adafruit_Sensor.h>
#include <ArduinoJson.h>

int A7Pin = A7;
int A9Pin = A9;
int A3Pin = A3;

// Sensor values from touch sensors
int val1 = 0;
int val2 = 0;
int val3 = 0;

// Sensor indicator ON - 1, OFF - 0
int sensorIndicator = 0;

unsigned long lastSend;
int sendRate = 500;

void setup() {
  // put your setup code here, to run once:
  pinMode(A3Pin, INPUT);
  pinMode(A9Pin, INPUT);
  pinMode(A7Pin, INPUT);
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  val1 = analogRead(A3Pin);
  val2 = analogRead(A7Pin);
  val3 = analogRead(A9Pin);

  int sumOfValues = val1 + val2 + val3;
  //Serial.print("Sum:");
  //Serial.print(sumOfValues);
  //Serial.print("\n");
  // Sensor on/off
  if (sumOfValues < 1000) {
    // Sensor is off
    sensorIndicator = 0;
    // Serial.print("Turning off");
  } else {
    // Sensor is on
    sensorIndicator = 1;
    // Serial.print("Turning on");
  }

  if(sensorIndicator == 1){
    // Use a timer to stabilize sending data
    if(millis()-lastSend >= sendRate){
      DynamicJsonBuffer messageBuffer(200); // Create a buffer for the JSON object
      JsonObject& p5Send = messageBuffer.createObject(); // Create a JsonObject variable in that buffer
      // Send only when the sensor has been touched
      p5Send["s1"] = sensorIndicator;
      p5Send["v1"] = val1;
      p5Send["v2"] = val2;
      p5Send["v3"] = val3;// Assign the ON/OFF indicator to the json object
      p5Send.printTo(Serial); // print JSON object to string
      Serial.println(); // print a newline character to the serial port to distinguish between objects
      lastSend = millis();    
    }
  }
}
