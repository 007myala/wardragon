var canvas;
var dataServer;
var pubKey = 'pub-c-b44da511-8d9d-4d62-8ef9-cf94247b6dc5';
var subKey = 'sub-c-a350389e-edad-11e8-b4c2-46cd67be4fbe';
var channelName = 'FindWithFriends';

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
     text(currIndustry, width/2, height/2);
}

function readIncoming(inMessage){
     // console.log(inMessage);
     if(inMessage.channel == channelName){
          // Get message id
          var mId = inMessage.message.id;
          var mInd = inMessage.message.ind;
     }
}

function whoIsConnected(connectionInfo){}

/* Function to make the canvas responsive to the screen */
function windowResized(){
     resizeCanvas(windowWidth, windowHeight);
}
