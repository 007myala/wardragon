/*
 * Meditation Vibe is a program that provides visual and haptic cues
 * to help with meditation
 * 
 * Code by Maria A Yala
 */
import processing.serial.*; // import the Processing serial library
Serial myPort;              // The serial port
int sensorValue;            // var to hold val from button trigger
int state;                  // var to hold state either 0 1 or 2
boolean isInhale = true;    // toggle between inhale & exhale states
boolean onHold = false;
int nX;
int timer;
int counter = -1;
int steps = 150; // 
int stepsE = 600;
int tSteps = 24;
int eSteps = 50;

void setup(){
  size(700, 700);
  // List all the available serial ports in the console
  // printArray(Serial.list()); // uncomment this to view your port Amaria

  // Change the 0 to the appropriate number of the serial port
  // that your microcontroller is attached to.
  String portName = Serial.list()[0];
  myPort = new Serial(this, portName, 9600);
  // read incoming bytes to a buffer
  // until you get a linefeed (ASCII 10):
  myPort.bufferUntil('\n');
}

void draw(){
  background(0);
  if(onHold){
    fill(255);
    textSize(32);
    textAlign(CENTER,CENTER);
    text("HOLD BREATH", width/2, height/2);
  } else {
    if(isInhale){
      // reset exhale circle size
      stepsE = 600;
      eSteps = 50;
      
      fill(255);
      ellipse(width/2,height/2,steps,steps);
      if(millis() - timer >= 250){
        // Check every 1/4 second
        steps = steps + 25;
        tSteps = tSteps + 1;
        if(steps >= 600){
          steps = 150;
        }
        if(tSteps >= 50){
          tSteps = 24;
        }
        timer = millis();
      }
      fill(0);
      textSize(tSteps);
      textAlign(CENTER,CENTER);
      // Person is inhaling - motar vibrates - circle grows
      text("INHALE", width/2, height/2);
    } else {
      // reset inhale circle size
      steps = 150;
      tSteps = 24;
      // Person is exhaling - no vibration - circle shrinks
      fill(255);
      ellipse(width/2,height/2,stepsE,stepsE);
      if(millis() - timer >= 250){
        // Check every 1/4 second
        stepsE = stepsE - 25;
        eSteps = eSteps - 1;
        if(stepsE <= 150){
          stepsE = 600;
        }
        if(eSteps <= 24){
          eSteps = 50;
        }
        timer = millis();
      }
      fill(0);
      textSize(eSteps);
      textAlign(CENTER,CENTER);
      text("EXHALE", width/2, height/2);
    }
  }
}

void serialEvent(Serial myPort){
  try {
    // read the serial buffer
    String myString = myPort.readStringUntil('\n');
    if(myString != null){
      println(myString);
      myString = trim(myString);
    
      // split the string at the commas
      // and convert the sections into integers
      int sensors[] = int(split(myString, ','));
      state = sensors[1];
      sensorValue = sensors[0];
      String vibe = "";
      if(state == 1){
        vibe = "Inhale";
        onHold = false;
        isInhale = true;
      } else if(state == 0){
        vibe = "Exhale";
        onHold = false;
        isInhale = false;
      } else if(state == 2){
        vibe = "On Hold";
        onHold = true;
      } else {
        println("Oops! Check the state values");
      }
      println("State is " + state + " person is " + vibe);
    }
  } catch(RuntimeException e){
    e.printStackTrace();
  }
}
