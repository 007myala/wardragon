/*
 * Artful Protest - artfulsensor.ino
 * Dev - MARIa deniSE Yala
 * 
 * This code was created with help from examples by Nick Puckett & Kate Hartman
 * from the Creaton & Computation - Digital Futures, OCAD Univeristy
 * 
 * Send 1 value to p5.js
 * Values formatted as JSON objects
 * 
 * Reads an Ultrasonic Proximity Sensor using the NewPing Library 
 * To install go to "Tools" -> "Manage Libraries" and search for "NewPing"
 * 
 * Last Modified - 07 / 11 / 18
 */
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <ArduinoJson.h> // Instal version 5.13.3 
#include <NewPing.h>

const int triggerPin = 3;
const int echoPin = 4;
float duration, distance; // Length of soundwave, how far away

int maxDist = 200; // Max distance helps sensor return a clearer value
int dVal; // Variable to hold the distance value

unsigned long lastSend;
int sendRate = 500;

NewPing proximity1(triggerPin, echoPin, maxDist); // Sets up the sensor object

void setup() {
  // put your setup code here, to run once:
  // triggerPin - OUTPUT, echoPin - INPUT
  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
  // Start serial communications
  Serial.begin(9600);
}

void loop() {
  // Sensor is triggered at a high pulse of 10
  // Trigger a low burst first to ensure a clean high signal
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);

  duration = pulseIn(echoPin, HIGH);
  // Print the values
  dVal = proximity1.ping_cm(); // Get the distance value in cm
  /*
  Serial.println("Distance: ");
  Serial.println(dVal);
  Serial.println("");
  */

  // Use a timer to stabilize sending data
  if(millis()-lastSend >= sendRate){
    DynamicJsonBuffer messageBuffer(200); // Create a buffer for the JSON object
    JsonObject& p5Send = messageBuffer.createObject(); // Create a JsonObject variable in that buffer

    p5Send["s1"] = dVal; // Assign distance to the key "s1" in the json object

    p5Send.printTo(Serial); // print JSON object to string
    Serial.println(); // print a newline character to the serial port to distinguish between objects

    lastSend = millis();
    delay(2000);
  }
}

/*
 * REFERENCES
 * __________
 * 
 * Sensor Code - Getting Started with the HC-SR04 Ultrasonic sensor
 * https://www.hackster.io/Isaac100/getting-started-with-the-hc-sr04-ultrasonic-sensor-036380
 * 
 * DigitalFuturesOCADU/CC18
 * https://github.com/DigitalFuturesOCADU/CC18/blob/master/P5_Arduino_Serial_IO/send_receive_Multiple/JSON%20Protocol/Input/2inputs/Arduino/arduinoP5serialJson_1button_1ana/arduinoP5serialJson_1button_1ana.ino
 */
