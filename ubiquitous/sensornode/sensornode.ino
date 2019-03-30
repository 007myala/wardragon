int radioID = 12; // put your radio number here
int sensorMin = 1023; //minimum photoresistor sensor value
int sensorMax = 0; //maximum sensor value
const int sensorPin = A0;

void setup() {
  // initialize serial communication at 9600 bits per second:
  Serial.begin(9600);
  Serial1.begin(9600);
  // calibrate the light sensor during the first five seconds
  while(millis() < 5000) {
    int calibrateValue = analogRead(sensorPin);
    // record max value
    if (calibrateValue > sensorMax) {
      sensorMax = calibrateValue;
    }
    // record min value
    if (calibrateValue < sensorMin) {
      sensorMin = calibrateValue;
    }
  }
}

void loop() {
  // read the input on analog pin 0:
  int pinValue = analogRead(sensorPin); 
  //map the data so it can be turned into a colour by Processing:
  int sensorValue = map(pinValue, sensorMin, sensorMax, 0, 255); 
    if(sensorValue > 255){
      sensorValue = 255;
    } 
    if(sensorValue < 0){
      sensorValue = 0;
    }
    
  Serial1.print(radioID);
  Serial.print(radioID);
  Serial1.print(",");
  Serial.print(",");
  Serial1.println(sensorValue);
  Serial.println(sensorValue);
  delay(800);        // delay in between reads for stability
}
