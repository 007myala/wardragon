/*
  Soma Garden is a program that controls the panels on a glass dome
  Drawing animations on the panels depending on the sensor reading
  That measure an individuals electro-dermal value

  Demonstrates analog input by reading an analog sensor on analog pin 0 and
  prints 

  Original code created by created by David Cuartielles
  modified 07 02 2019
  By Maria Yala
*/

int sensorPin = A0;    
int sensorValue = 0;  // variable to store the value coming from the sensor

void setup() {
  Serial.begin(9600);  
}

void loop() {
  // read the value from the sensor:
  sensorValue = analogRead(sensorPin);
  
  //Serial.println(sensorValue);
  
  if(sensorValue == 0){
    // No bio data - clear dome walls
    Serial.println("Dome walls go white / clear");
  } else if (sensorValue > 0 && sensorValue < 20) { 
    // Hands not very sweaty - small animation e.g grass swaying
    Serial.println("Grass blades swaying");
  } else if (sensorValue >= 20 && sensorValue < 60) {
    // Hands slightly moist - fill half the dome
    Serial.println("Grass blades swaying, flowers growing to half the dome's height");
  } else if (sensorValue >= 60 && sensorValue < 120) {
    // Hands sweaty - fill 2/3 of the dome
    Serial.println("Grass blades swaying, flowers and plants grow to cover 3/4 of the dome");
  } else if (sensorValue >= 120){
    // Hands very sweaty - full animation - fill the whole dome with plants
    Serial.println("Whole dome fills with flowers and plants");
  } else {
    Serial.println("Error in sensorValue reading.");
  }
  delay(500);
};
