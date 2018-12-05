/*
     This file grabs the current industry found from the wordsearch
     and displays it on the screen
*/
var canvas;
var serial; // serial port object
var sensorIndicator = 0;
var serialPortName = "/dev/ttyUSB0"; // Set this to your port
var touchSensorsON = false;

// PubNub
var dataServer;
var pubKey = 'pub-c-492eadd3-274a-4f66-bc2b-275f441475f0';
var subKey = 'sub-c-f1fc1aa0-f805-11e8-aba4-3a82e8287a69';
var channelName = 'CrossWithFriends';

var title = "CROSS THE DRAGON";
var currIndustry = "CROSS THE DRAGON";

// Videos
var vid1;
var vid2;

// States
var state1 = false; // Project no video
var state2 = false; // Project video 1
var state3 = false; // Project video 2
var isPlaying = false;

function preload(){
     vid1 = createVideo('../crossthedragon/video/Boat.mp4');
     vid2 = createVideo('../crossthedragon/video/Boat_13.mp4');
}

function setup(){
     canvas = createCanvas(0,0);

     serial = new p5.SerialPort(); // Create a serial port object
     serial.open(serialPortName); // Open the serial port
     serial.on('open', ardCon); // Open the socket connection
     serial.on('data', dataReceived); // Execute the dataReceived function

     // Initialize pubnub
     dataServer = new PubNub({
          publish_key    : pubKey,
          subscribe_key   : subKey,
          ssl  : true // Enables a secure connection. Required of OCAD workspace
     });

     // Attach callbacks to the pubnub object to handle messages and connections
     dataServer.addListener({
          message: readIncoming,
          presence: whoIsConnected
     })
     dataServer.subscribe({
          channels: [channelName]
     });

     vid1.parent('vcontainer');
     vid1.id('myvid');
     // vid1.loop();
}

function draw(){
     /* // Testing the ON/OFF functionality
     if(touchSensorsON){
          background(255);
          fill(0);
     } else {
          background(0);
          fill(255);
     }
     textSize("60");
     textAlign(CENTER,CENTER);
     textSize(50);
     text(currIndustry, width/2, height/2); */
}

function readIncoming(inMessage){
     // console.log(inMessage);
     if(inMessage.channel == channelName){
          // Get message id
          var mId = inMessage.message.i;
          // console.log(inMessage.message);
          if(mId == 2){
               currIndustry = inMessage.message.ind;
               //console.log("Current industry is " + currIndustry);
          } else {
               // console.log("Not the video 1 category message");
          }
     }
}

function whoIsConnected(connectionInfo){}

/* Function called every time data is received from the serial port */
function dataReceived(){
     var rawData = serial.readStringUntil('\r\n'); // Stop reading at newline
     //console.log(rawData);
     //print("Getting this " + rawData);
     if(rawData.length > 1){
          // Check that data is being received
          sensorIndicator = JSON.parse(rawData).s1;
     } else {
          //print('Not getting any sensor data');
     }

     if(sensorIndicator == 0){
          touchSensorsON = false;
          print("Sensors are OFF");
     } else if(sensorIndicator == 1) {
          touchSensorsON = true;
          print("Sensors are ON");
     } else {
          //print("Something went wrong check 's1' val sent by JSON");
          //print(JSON.parse(rawData).s1);
     }
     makeProjections();
}

function makeProjections(){
     if(touchSensorsON){
          // Mat has been touched - start a projection
          if(!isPlaying){
               //vid2.pause();
               vid1.play();
               isPlaying = true;
          } else {
               vid1.pause();
               //vid2.play();
               isPlaying = false;
          }
     } else {
          // Touch sensors are off - ignore
     }
}

/* Function to record arduino connection */
function ardCon(){
     console.log("Connected to the Arduino. LISTEN UP");
}


/* Function to make the canvas responsive to the screen */
function windowResized(){
     resizeCanvas(windowWidth, windowHeight);
}
