/*
 * Weather Tarot by Maria Yala
 *
 * Code creted using reference from template below:
 * Ubiquitous Computing - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 *
 * Uses a PubNub function to query the Wolfram Conversation API
 */

// server variables

var dataServer;
var pubKey = 'pub-c-9c3e6d99-ba98-485c-befc-9faf7976f92e';
var subKey = 'sub-c-40fa9ee4-23f1-11e9-8321-261899e2d3ad';

var canvas;
var countries = []; // an array to hold countries

//input variables
var sendText;
var sendButton;

//size of the active area
var cSizeX; //= 1300; //900;
var cSizeY;// = 600;

var returnedAnswer = [];

var mapWidth, mapHeight;


//This must match the channel you set up in your function
var channelName = "wolfram";
var currCountry;

let tableVar;

function preload(){
     // Load the csv file.
     tableVar = loadTable('countries.csv','csv','header');
     print("Preload called");
}

function setup()
{
  getAudioContext().resume();
  cSizeX = windowWidth;
  cSizeY = windowHeight;
  print("Screen width " + cSizeX);
  print("Screen height " + cSizeY);
  canvas = createCanvas(cSizeX, cSizeY);
  canvas.style('display','block');
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

  /*
  //create the text fields for the message to be sent
  sendText = createInput();
  sendText.position(5,height);

  sendButton = createButton('Ask a Question');
  sendButton.position(sendText.x + sendText.width,height);
  sendButton.mousePressed(sendTheMessage);
  */

  // Read the countries.csv file and load countries
  loadCountries();
}

function draw(){
     drawCountries();
}

function loadCountries(){
     print("Load Countries called!");
     var cd =0;
     var lt =0;
     var lg = 0;
     var n = 0;
     for(let r = 0; r < tableVar.getRowCount(); r++){
          for(let c = 0; c < tableVar.getColumnCount(); c++){
               if(c == 0){
                    // Country code
                    cd = tableVar.getString(r,c);
                    //print(cd);
               } else if(c == 1){
                    // Latitude
                    lt = tableVar.getString(r,c);
                    //print(lt);
               } else if(c == 2){
                    // Longitude
                    lg = tableVar.getString(r,c);
                    //print(lg);
               } else if (c == 3){
                    // Country name
                    n = tableVar.getString(r,c);
                    //print(n);
               }
          }
          // draw the countries
          drawCountries(cd,lt,lg,n);
     }


}

function drawCountries(code,clat,clong,cname){
     var country = new Country(code,clat,clong,cname);
     country.translate(mapWidth,mapHeight);
     country.display();
     // save the country
     countries.push(country);
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

function mouseClicked(){
     // Check if country was clicked
     for(var i = 0; i < countries.length; i++){
          countries[i].clickCheck(mouseX,mouseY);
     }
}

function whoisconnected(connectionInfo)
{

}
