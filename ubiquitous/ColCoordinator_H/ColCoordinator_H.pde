/*
 * Sensor Coordinator code was written using the Metronome Coordinator (Processing Code) as reference 
 * DIGF 6003 Ubiquitous Computing - Kate Hartman & Nick Puckett
 * This program reads in data (RGB color values) send by an XBee radio and 
 * uses them to change the background of a sketch, program works using 
 * a call/response handshake method which was written using code from the source below as reference.
 * https://itp.nyu.edu/physcomp/labs/labs-serial-communication/two-way-duplex-serial-communication-using-an-arduino/
 */

import processing.serial.*; // import the Processing serial library
Serial myPort;              // The serial port
int red = 255;
int green = 255;
int blue = 255;

boolean firstContact = false; // Check for first msg
                                     
void setup() {
  size(700, 700);
  // List all the available serial ports in the console
  // printArray(Serial.list()); // uncomment this to view your port Amaria

  // Change the 0 to the appropriate number of the serial port
  // that your microcontroller is attached to.
  String portName = Serial.list()[32];
  myPort = new Serial(this, portName, 9600);
  // read incoming bytes to a buffer
  // until you get a linefeed (ASCII 10):
  myPort.bufferUntil('\n');
}

/*
 *  This function changes the background color of a sketch 
 */
void draw() {
  background(red,green,blue);
    
  // Draw the labels at the square's center @maria
    textAlign(CENTER,CENTER);
    fill(0);
    text(red, 100, 100);
    text(green, 150, 100);
    text(blue, 200, 100);
}

void serialEvent(Serial myPort) {
  // read the serial buffer:
  String myString = myPort.readStringUntil('\n');
  if (myString != null) {
    myString = trim(myString);
    if(firstContact == false){
      if(myString.equals("hello")){
        myPort.clear(); // Clear the serial buffer
        firstContact = true; // First contact has been made
        myPort.write('A'); // Ask for more
      }
    } else {
      // already had first contact
      // split the string at the commas
      // and convert the sections into integers:
      int colors[] = int(split(myString, ','));
      red = colors[0];  
      green = colors[1]; 
      blue = colors[2];
      
      println("Red: " + red + " Green: " + green + " Blue: " + blue);
    }
    // Ask for more sensor values when done parsing
    myPort.write("A");
  }
}
