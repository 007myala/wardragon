/*
 * Smart Charms is a self-help program that takes sensor values from a serial connection
 * and creates a calming visualization on the screen by manipulating the data
 */
 
import processing.serial.*; // import the Processing serial library
Serial myPort;              // The serial port
int mVal = 0;
int stressLevel = 0; // Low number is very stressed, high number is calm.

int[] reds = {153,230,255,204,153,153,153,102,51,0};
int[] greens = {0,38,0,0,0,0,0,0,0,0};
int[] blues = {0,0,43,34,51,102,153,153,26};

int[] positions = {};
float[] coords = {};
int[] readings = {};

void setup(){
  size(700,700);
  
  // List all the available serial ports in the console
  // printArray(Serial.list()); // uncomment this to view your port @maria

  // Change the 0 to the appropriate number of the serial port
  // that your microcontroller is attached to.
  String portName = Serial.list()[0];
  myPort = new Serial(this, portName, 9600);
  // read incoming bytes to a buffer
  // until you get a linefeed (ASCII 10):
  myPort.bufferUntil('\n');
}

void draw(){
  background(255);
   /*
   int pos = stressLevel - 1;
   if(pos < 0){
      pos = 0;
   } 
    
   fill(reds[pos], greens[pos], blues[pos]);
   noStroke();
   ellipse(random(0,700),random(0,700),mVal,mVal);
  */
  
  // Draw only last 20 shapes
  int size = positions.length;
  int last20 = 0;
  if (size >= 10){
    last20 = size - 10;
  }
  
  for(int i = last20; i < positions.length; i++){
    // Get the position / stress level val / xy coordinates and value.
    int pos = positions[i];
    fill(reds[pos], greens[pos], blues[pos]);
    noStroke();
    ellipse(coords[i],coords[i],readings[i],readings[i]);
  }
}

void serialEvent(Serial myPort) {
  try {
    // read the serial buffer
    String myString = myPort.readStringUntil('\n');
    if(myString != null){
      println(myString);
      myString = trim(myString);
      
      // split hte string at the commas
      int values[] = int(split(myString, ','));
      mVal = values[1];
      stressLevel = values[3];
      
      println("Stress toy reading is " + mVal + " at level " + stressLevel);
      println();
      
      saveReadings(mVal,stressLevel);
    }
  } catch(RuntimeException e){
    e.printStackTrace();
  }
}

void saveReadings(int mVal, int sLevel){
    int pos = sLevel - 1;
    if(pos < 0){
      pos = 0;
    } 
    // save the position value
    positions = append(positions,pos);
    
    // save the original value
    readings = append(readings,mVal);
    
    // generate a random coordinate
    float xy = random(0,700);
    coords = append(coords, xy);
}


 
