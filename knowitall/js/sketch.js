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
var dateTime = [];

var mapWidth, mapHeight;

//This must match the channel you set up in your function
var channelName = "wolfram";
var currCountry;
var countryDotX;
var countryDotY;

let tableVar;

// Daytime & Nightime colors
// night to sunrise
var nts1, nts2, nts3, nts4, nts5;

// sunrise
var srs1, srs2, srs3, srs4, srs5;

// midnight
var mnt0, mnt1, mnt2, mnt3;

// mornings
var mrn0, mrn1, mrn2, mrn3;

// midday
var mdd0, mdd1,mdd2,mdd3,mdd4;

// afternoon
var aft0,aft1,aft2,aft3;

//evening
var eve0,eve1,eve2;

var isAM = false;

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

  // Setup the Colors
  nts1 = color(13,36,50);
  nts2 = color(53,48,59);
  nts3 = color(93,59,69);
  nts4 = color(132,71,78);
  nts5 = color(172,83,88);
  srs1 = color(242,216,91);
  srs2 = color(246,201,99);
  srs3 = color(249,182,109);
  srs4 = color(251,171,114);
  srs5 = color(251,144,117);
  mnt0 = color(0,0,0);
  mnt1 = color(0,0,14);
  mnt2 = color(0,0,31);
  mnt3 = color(0,0,46);
  mrn0 = color(49,100,198);
  mrn1 = color(0,173,255);
  mrn2 = color(75,197,255);
  mrn3 = color(107,207,255);
  mdd0 = color(172,234,255);
  mdd1 = color(125,210,248);
  mdd2 = color(251,234,97);
  mdd3 = color(255,231,0);
  mdd4 = color(255,219,0);
  aft0 = color(227,94,24);
  aft1 = color(212,54,41);
  aft2 = color(103,81,102);
  aft3 = color(70,78,122);
  eve0 = color(32,48,96);
  eve1 = color(73,76,114);
  eve2 = color(10,19,64);

  // Read the countries.csv file and load countries
  loadCountries();
}

function draw(){}

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
  var query = "local time " + currCountry;

  // Send Data to the server to draw it in all other canvases
  dataServer.publish(
    {
      channel: channelName,
      message:
      {
        text: query       //text: is the message parameter the function is expecting
      }
    });

}

function readIncoming(inMessage) //when new data comes in it triggers this function,
{                               // this works becsuse we subscribed to the channel in setup()
    console.log(inMessage);  //log the entire response
                          //the message parameter to look for is answer
    noStroke();
    fill(0);  //read the color values from the message
    textSize(12);
    text(inMessage.message.answer, 5, height/2);
    returnedAnswer=inMessage.message.answer.split(" ");
    // find
    var time;
    var amPM;
    for(var i = 0; i < returnedAnswer.length; i++){
         if(returnedAnswer[i] == "is"){
              time = returnedAnswer[i+1];
              amPM = returnedAnswer[i+2];
              break;
         }
    }
    print("Time is " + time + " " + amPM);
    dateTime = time.split(":");
    var hrs = dateTime[0]; // Get the hour
    if(amPM == "A.M."){
         isAM = true;
    } else {
         isAM = false;
    }

    if(hrs >= 12 && hrs < 1){
         if(isAM){
              setGradient(0,0,windowWidth,windowHeight,mnt1,mnt2);
         } else{
              setGradient(0,0,windowWidth,windowHeight,mdd0,mdd1);
         }
    } else if(hrs >= 1 && hrs < 2){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,mnt2,mnt3);
        } else{
             setGradient(0,0,windowWidth,windowHeight,mdd1,mdd2);
        }
    } else if(hrs >= 2 && hrs < 3){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,mnt3,nts1);
        } else{
             setGradient(0,0,windowWidth,windowHeight,mdd2,mdd3);
        }
    } else if(hrs >= 3 && hrs < 4){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,nts1,nts2);
        } else{
             setGradient(0,0,windowWidth,windowHeight,mdd3,mdd4);
        }
    } else if(hrs >= 4 && hrs < 5){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,nts2,nts3);
        } else{
             // setGradient(0,0,windowWidth,windowHeight,mdd4,aft0);
             setGradient(0,0,windowWidth,windowHeight,aft0,aft1);
        }
    } else if(hrs >= 5 && hrs < 6){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,nts3,nts4);
        } else{
             setGradient(0,0,windowWidth,windowHeight,aft1,aft2);
        }
    } else if(hrs >= 6 && hrs < 7){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,nts5,srs5);
        } else{
             setGradient(0,0,windowWidth,windowHeight,aft2,aft3);
        }
    } else if(hrs >= 7 && hrs < 8){
         if(isAM){
             setGradient(0,0,windowWidth,windowHeight,srs5,mrn0);
        } else {
             setGradient(0,0,windowWidth,windowHeight,aft3,eve0);
        }
    } else if(hrs >= 8 && hrs < 9){
         if(isAM){
              setGradient(0,0,windowWidth,windowHeight,mrn0,mrn1);
         } else{
              setGradient(0,0,windowWidth,windowHeight,eve0,eve1);
         }
    } else if(hrs >= 9 && hrs < 10){
         if(isAM){
              setGradient(0,0,windowWidth,windowHeight,mrn1,mrn2);
         } else{
              setGradient(0,0,windowWidth,windowHeight,eve1,eve2);
         }
    } else if(hrs >= 10 && hrs < 11){
         if(isAM){
              setGradient(0,0,windowWidth,windowHeight,mrn2,mrn3);
         } else{
              setGradient(0,0,windowWidth,windowHeight,eve2,mnt0);
         }
    } else if(hrs >= 11 && hrs < 12){
         if(isAM){
              setGradient(0,0,windowWidth,windowHeight,mrn3,mdd0);
        } else {
             setGradient(0,0,windowWidth,windowHeight,mnt0,mnt1);
        }
    }
    drawMarkers();
}

function drawMarkers(){
     for(var i = 0; i < countries.length; i++){
          countries[i].drawMarker();
     }

     // draw the labels
     textAlign(CENTER,CENTER);
     fill(255);
     textSize(24);
     text(currCountry,3*windowWidth/4,windowHeight-50);

     // draw the draw
     fill(0);
     noStroke();
     ellipse(countryDotX,countryDotY,10,10);
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

function setGradient(x,y,w,h,c1,c2){
     for (var i = y; i <= y+h; i++) {
          var inter = map(i, y, y+h, 0, 1);
          var c = lerpColor(c1, c2, inter);
          stroke(c);
          line(x, i, x+w, i);
     }
}
