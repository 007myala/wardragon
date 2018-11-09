/*
     ARTFUL PROTEST - sketch.js
     Dev : MARIa deniSE Yala
     Ver : 1.0
     Last Modified : 07 / 11 / 18

     Requires p5.serialcontrol to be running

     Reads 1 sensor value from arduino
     Triggers animations on the ARTFUL PROTEST installation

     This code was created with help from examples by Nick Puckett & Kate Hartman
     from the Creaton & Computation - Digital Futures, OCAD University
*/

var canvas;
var serial; // serial port object
var sensor1 = 0; // var to hold the value from "s1"
var animation = 0; // var to hold indicator for which animation to play
var serialPortName = "/dev/ttyACM0"; // Set this to your port
var isProtesting = false; // Boolean, installation starts with watch screen
var dumpCnt = 0;
var blackoutFont;
var goudyFont;
var junctionFont;
var msg, msg1;

function preload(){
     blackoutFont = loadFont('./fonts/Blackout Sunrise.ttf');
     goudyFont = loadFont('./fonts/OFLGoudyStM.otf');
     junctionFont = loadFont('./fonts/Junction-bold.otf');
}

/* Automatically fill the window */
function setup(){
     canvas = createCanvas(windowWidth, windowHeight);
     serial = new p5.SerialPort(); // Create a serial port object
     serial.open(serialPortName); // open the serial port
     serial.on('open', ardCon); // open the socket connection and execute the ardCon callback
     serial.on('data', dataReceived); // execute the dataReceived function when data is received
     frameRate(2);
}

function draw(){
     if(isProtesting){
          background(0); // Black
          // Check the sensor values and choose an animation
          if(animation == 0){
               // Dump Trump
               var women = "W o m e n";
               var d = "D ";
               var tr = "T r ";
               var ump = "u m p";
               textSize(120);
               textAlign(CENTER,CENTER);
               textFont(blackoutFont);
               fill(255);
               text(women, 0, 0, width, height/2);
               if((dumpCnt % 2) == 0){
                    msg = d + ump;
                    text(msg, 0, height/2, width, height/2);
               } else {
                    msg = tr + ump;
                    text(msg, 0, height/2, width, height/2);
               }
               dumpCnt += 1;
          } else if(animation == 1){
               // Love is Love
               var love = "L O V E";

          }
     } else {
          // Person isn't raising the protest sign, show watch screen
          background(255);
          textSize(82);
          textFont(goudyFont);
          fill(0);
          textAlign(CENTER,TOP);
          msg = "...Climate change is real...Time's up...Families are seperated at the border...Toxic masculinity kills...Hate crimes are on the rise...Black lives are in danger...We need stricter gun control..."
          text(msg, 0, 20, width, height);
     }
}

/* Function called every time data is received from the serialport */
function dataReceived(){
     var rawData = serial.readStringUntil('\r\n'); // Stop reading at newline
     console.log(rawData); // Uncomment to view incoming sensor data
     if(rawData.length > 1){
          // Check that data is being received
          sensor1 = JSON.parse(rawData).s1; // "s1" parameter must match declaration in arduino file
          print("This is my reading");
          print(sensor1);
          print("*");
     } else {
          print('Not getting any sensor data');
     }

     if(sensor1 > 30){
          isProtesting = true;
          print("Protesting");
     } else {
          isProtesting = false;
          print("Watching");
     }
}

/* Function to record arduino connection */
function ardCon(){
     console.log("Connected to the Arduino. LISTEN UP");
}

/* Make the canvas responsive -- automatically resize the window */
function windowResized(){
     resizeCanvas(windowWidth, windowHeight);
}
