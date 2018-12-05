/*
     This file grabs the current industry found from the wordsearch
     and displays it on the screen 
*/
var canvas;

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
     background(0);
     textSize("60");
     fill(255);
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

/* Function to make the canvas responsive to the screen */
function windowResized(){
     resizeCanvas(windowWidth, windowHeight);
}
