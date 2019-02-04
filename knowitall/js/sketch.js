/*
 *
 *
 * Code creted using reference from template below:
 * Ubiquitous Computing - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 *
 * Uses a PubNub function to query the Wolfram Conversation API
 *
 *
 */

// server variables

var dataServer;
var pubKey = 'pub-c-9c3e6d99-ba98-485c-befc-9faf7976f92e';
var subKey = 'sub-c-40fa9ee4-23f1-11e9-8321-261899e2d3ad';

//input variables
var sendText;
var sendButton;

//size of the active area
var cSizeX = 900;
var cSizeY = 600;

var returnedAnswer = [];

// latitude & longitude
var clat = ''; // country latitude
var clong = ''; // country longitude
var code;
var cname;

var mapWidth, mapHeight;



//This must match the channel you set up in your function
var channelName = "wolfram";

function setup()
{
  getAudioContext().resume();
  createCanvas(cSizeX, cSizeY);
  background(255);

  mapWidth = cSizeX;
  mapHeight = cSizeY;

  mX = 0;
  mY = 0;

   // initialize pubnub
  dataServer = new PubNub(
  {
    publish_key   : pubKey,  //get these from the pubnub account online
    subscribe_key : subKey,
    ssl: true  //enables a secure connection. This option has to be used if using the OCAD webspace
  });

  //attach callbacks to the pubnub object to handle messages and connections
  dataServer.addListener({ message: readIncoming})
  dataServer.subscribe({channels: [channelName]});

  //create the text fields for the message to be sent
  sendText = createInput();
  sendText.position(5,height);

  sendButton = createButton('Ask a Question');
  sendButton.position(sendText.x + sendText.width,height);
  sendButton.mousePressed(sendTheMessage);

  // Read the countries.csv file and load countries
  loadCountries();
}

function draw(){
     drawCountries();
}

function drawCountries(){
     // code, latitude, longitude, name
     /*code = "KE";
     clat = -0.023559;
     clong = 37.906193;
     cname = "Kenya";

     code = "CA";
     clat = 56.130366;
     clong = -106.346771;
     cname = "Canada";

     code ="US";
     clat = 37.09024;
     clong = -95.712891;
     cname = "United States";*/

     code = "SD";
     clat = 12.862807;
     clong = 30.217636;
     cname = "Sudan";

     var country = new Country(code,clat,clong,cname);
     country.translate(mapWidth,mapHeight);
     country.display();
}


///uses built in mouseClicked function to send the data to the pubnub server
function sendTheMessage() {

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message:
      {
        text: sendText.value()       //text: is the message parameter the function is expecting
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function,
{                               // this works becsuse we subscribed to the channel in setup()
    console.log(inMessage);  //log the entire response
                          //the message parameter to look for is answer
    background(255);
    noStroke();
    fill(0);  //read the color values from the message
    textSize(20);
    text(inMessage.message.answer, 5, height/2);
    returnedAnswer=inMessage.message.answer.split(" ");

}

function whoisconnected(connectionInfo)
{

}
