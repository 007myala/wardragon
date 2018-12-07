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
var touchCount = 0;

// Videos
var vid0;
var vid1;
var vid2;
var videos1 = []; // First videos
var videos2 = []; // Second videos

// States
var state = 0;
var isv1Playing = false;
var isv2Playing = false;

function preload(){
     // Init videos
     vid0 = createVideo('../crossthedragon/video/ctdlogo.mp4');

     // Transport 0, Energy 1, Real estate 2, Finance 3
     // First videos
     videos1[0] = createVideo('../crossthedragon/video/transportV1.mp4');
     videos1[1] = createVideo('../crossthedragon/video/energyV1.mp4');
     videos1[2] = createVideo('../crossthedragon/video/realestateV1.mp4');
     //videos1[3] = createVideo('../crossthedragon/video/financeV1.mp4');
     videos1[3] = createVideo('../crossthedragon/video/Boat.mp4');

     // Second videos
     videos2[0] = createVideo('../crossthedragon/video/transportV2.mp4');
     //videos2[1] = createVideo('../crossthedragon/video/energyV2.mp4');
     videos2[2] = createVideo('../crossthedragon/video/realestateV2.mp4');
     //videos2[3] = createVideo('../crossthedragon/video/financeV2.mp4');
     videos2[1] = createVideo('../crossthedragon/video/Boat_13.mp4');
     videos2[3] = createVideo('../crossthedragon/video/Boat_13.mp4');
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

     // hide the videos
     for(var i = 0; i < videos1.length; i++){
          var vid = videos1[i];
          vid.hide();
     }

     for(var i = 0; i < videos2.length; i++){
          var vid = videos2[i];
          vid.hide();
     }

     // Initialize the video variables
     vid1 = videos1[0];
     vid2 = videos2[0];

     // Link to css tags
     vid0.parent('vcontainer');
     vid1.parent('vcontainer');
     vid2.parent('vcontainer');
     vid0.id('myvid0');
     //vid1.id('myvid1');
     //vid2.id('myvid2');

     // Start the first video projection
     makeProjectionsInitVid();
}

function draw(){}

function readIncoming(inMessage){
     // console.log(inMessage);
     if(inMessage.channel == channelName){
          // Get message id
          var mId = inMessage.message.i;
          // console.log(inMessage.message);
          if(mId == 2){
               currIndustry = inMessage.message.ind;
               console.log("Current industry is " + currIndustry);
               // Set up the videos as per industry
               setupProjections(currIndustry);
               // Start the first projection if in the right state
               makeProjectionsFirstVid();
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
          makeProjectionsSecVid();
     } else {
          //print("Something went wrong check 's1' val sent by JSON");
          //print(JSON.parse(rawData).s1);
     }
}

/* Sets up the vid1 and vid2 according to the industries */
function setupProjections(ind){
     vid1.hide();
     vid2.hide();
     print("Setup the videos for this industry:" + ind);
     if(ind == "Transport"){
          vid1 = videos1[0];
          vid2 = videos2[0];
     } else if(ind == "Energy"){
          vid1 = videos1[1];
          vid2 = videos2[1];
     } else if(ind == "Real Estate"){
          vid1 = videos1[2];
          vid2 = videos2[2];
     } else if(ind == "Finance"){
          vid1 = videos1[3];
          vid2 = videos2[3];
     } else {
          vid1 = vid0;
          vid2 = vid0;
     }
     vid1.id('myvid1');
     vid2.id('myvid2');
}

function makeProjectionsInitVid(){
     if(state == 0){
          print("Playing the dragon animation");
          // Stop & hide other videos
          vid1.pause();
          vid2.pause();
          vid1.hide();
          vid2.hide();

          // Reset isPlaying values
          isv1Playing = false;
          isv2Playing = false;

          // Play animation
          vid0.show();
          vid0.loop();
          print("State " + state);
          state++;
     } else {
          // Might be in First or Second vid state
     }
}

function makeProjectionsFirstVid(){
     if(state == 1){
          // Hide other videos
          vid2.pause();
          vid0.pause();
          vid2.hide();
          vid0.hide();

          // Update is playing
          isv2Playing = false;

          // Play this video
          vid1.show();
          vid1.loop();
          print("State " + state);
          state = 2;
     } else {
          // Might be in Init state of Second vid state
     }
}

function makeProjectionsSecVid(){
     if(touchSensorsON){
          // TODO move this stops and pauses into a function
          if(state == 2){
               // Hide other videos
               vid1.pause();
               vid1.hide();

               // Play this video only if it isn't playing
               if(!isv2Playing){
                    print("Playing vid 2");
                    print("State " + state);
                    vid2.show();
                    vid2.loop();
                    state = 1; // Reset to 1 so that next projection can be triggered
                    isv2Playing = true;
               } else {
                    // video is already playing don't do anything
                    // reset in word call - isPlaying() = false;
               }
          }
     } else {
          // Touch sensors are off - ignore
          touchSensorsON = false;
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

/*
     REFERENCES
     __________
     Hiding & Showing HTML5 Video - https://creative-coding.decontextualize.com/video/
     Video array - https://forum.processing.org/two/discussion/23870/p5js-problem-with-asynchronous-video-loading-playing
     HTML5 Video Features - https://addpipe.com/blog/10-advanced-features-in-html5-video-player/
     Hiding & Showing video - https://www.reddit.com/r/jquery/comments/2hb4iq/how_can_i_hide_a_html5_video_when_it_finishes/
*/
