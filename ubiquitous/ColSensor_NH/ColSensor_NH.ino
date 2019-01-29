/*
 * Color Radio - reads in RGB values from a color sensor and lights up a NeoPixel Strip
 * 
 */ 
#include <Adafruit_NeoPixel.h>  
#ifdef __AVR__  
#include <avr/power.h>  
#endif  

// Which pin on the Arduino is connected to the NeoPixels?  
#define PIN 6 

 // How many NeoPixels are attached to the Arduino?  
#define NUMPIXELS 60  
   
Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);  
   
int delayval = 333; // delay 

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

  pixels.begin(); // This initializes the NeoPixel library
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
  Serial.print(Red);
  Serial.print(",");
  Serial.print(Green);
  Serial.print(",");
  Serial.println(Blue);

  Serial1.print(Red);
  Serial1.print(",");
  Serial1.print(Green);
  Serial1.print(",");
  Serial1.println(Blue);
  
  colorWipe(pixels.Color(Red, Green, Blue), 50); 
  
  delay(300);
}

// Fill the dots one after the other with a color
// Code Source & Ref: Adafruit Neopixel Examples - Strandtest
void colorWipe(uint32_t c, uint8_t wait) {
  for(uint16_t i=0; i<pixels.numPixels(); i++) {
    pixels.setPixelColor(i, c);
    pixels.setBrightness(64);
    pixels.show();
    delay(wait);
  }
}

void rainbow(uint8_t wait) {
  uint16_t i, j;

  for(j=0; j<256; j++) {
    for(i=0; i<pixels.numPixels(); i++) {
      pixels.setPixelColor(i, Wheel((i+j) & 255));
    }
    pixels.show();
    delay(wait);
  }
}

// Input a value 0 to 255 to get a color value.
// The colours are a transition r - g - b - back to r.
uint32_t Wheel(byte WheelPos) {
  WheelPos = 255 - WheelPos;
  if(WheelPos < 85) {
    return pixels.Color(255 - WheelPos * 3, 0, WheelPos * 3);
  }
  if(WheelPos < 170) {
    WheelPos -= 85;
    return pixels.Color(0, WheelPos * 3, 255 - WheelPos * 3);
  }
  WheelPos -= 170;
  return pixels.Color(WheelPos * 3, 255 - WheelPos * 3, 0);
}

// Code Reference : http://www.robotsforfun.com/webpages/colorsensor.html
