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
var serialPortName = "/dev/ttyACM0"; // Set this to your port
var isProtesting = false; // Boolean, installation starts with watch screen

function preload(){
     // Load any initial images here
}

/* Automatically fill the window */
function setup(){
     canvas = createCanvas(windowWidth, windowHeight);
     serial = new p5.SerialPort(); // Create a serial port object
     serial.open(serialPortName); // open the serial port
     serial.on('open', ardCon); // open the socket connection and execute the ardCon callback
     serial.on('data', dataReceived); // execute the dataReceived function when data is received
}

function draw(){
     if(isProtesting){
          // Check the sensor values and choose an animation
          background(0);
          rect(100,100,40,40);
     } else {
          // Person isn't raising the protest sign, show watch screen
          background(232);
          textSize(100);
          textAlign(CENTER,TOP);
          var msg = "Climate change is real. Families are seperated at the border. Toxic masculinity kills."
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
     } else {
          isProtesting = false;
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
