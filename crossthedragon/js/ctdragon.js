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

function setup(){
     canvas = createCanvas(windowWidth, windowHeight);
     canvas.style('display','block');
     canvas.parent('mcontainer'); // In html file

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
}

function draw(){
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
     text(currIndustry, width/2, height/2);
}

function readIncoming(inMessage){
     // console.log(inMessage);
     if(inMessage.channel == channelName){
          // Get message id
          var mId = inMessage.message.i;
          // console.log(inMessage.message);
          if(mId == 2){
               currIndustry = inMessage.message.ind;
               console.log("Current industry is " + currIndustry);
          } else {
               // console.log("Not the video 1 category message");
          }
     }
}

function whoIsConnected(connectionInfo){}

/* Function called every time data is received from the serial port */
function dataReceived(){
     var rawData = serial.readStringUntil('\r\n'); // Stop reading at newline
     console.log(rawData);
     print("Getting this " + rawData);
     if(rawData.length > 1){
          // Check that data is being received
          sensorIndicator = JSON.parse(rawData).s1;
          print("This is my reading");
          print(sensorIndicator);
          print("*");
     } else {
          print('Not getting any sensor data');
     }

     if(sensorIndicator == 0){
          touchSensorsON = false;
          print("Sensors are OFF");
     } else if(sensorIndicator == 1) {
          touchSensorsON = true;
          print("Sensors are ON");
     } else {
          print("Something went wrong check 's1' val sent by JSON");
          print(JSON.parse(rawData).s1);
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
