/*
     CROSS THE DRAGON
     Team: Norbert Zhao, Alicia Blakey, and Maria Yala
     Ver: 1.0
     Last Modified: 23 / 30 / 18

     Cross the dragon - combines the interactions from Maria Yala's FindWithFriends
     & Alicia Blakey's Soundbeats & Heartbeats.

     Gets a word found from the wordsearch and passes it to crossthedragon.js to trigger a video projection

     This code was created with help/reference from examples by Nick Puckett & Kate Hartman
     from the Creation & Computation - Digital Futures, OCAD University
*/
var canvas;
var tiles = []; // An array to hold the square tiles
var letters = []; // A nested array to hold letters
var totTx = 11; // Total number of tiles to create in the x direction
var totTy = 11; // Total number of tiles to create in the y direction
var border = 30;
var counter = 0;
var pcounter = 0;
var tcounter = 0;
var maxRadius; // Sets the radius of the circle in the tiles
var pr,pg,pb; // Random color for each player
var mwhite = "255255255";
var mred = "2552626";
var isUndo = false;
var lockPressed = false;
var catT = 0;
var catE = 0;
var catR = 0;
var catF = 0;
var currIndustry = "";
var shouldStartProjection = false;

var crossWithFriends = ['O','B','T','R','A','N','S','P','O','R','T',
                        'Q','E','P','V','I','T','Y','R','S','D','O',
                        'M','T','I','F','L','B','M','Y','I','Q','W',
                        'Z','A','N','I','M','B','E','K','J','O','X',
                        'G','T','E','N','U','G','D','W','P','E','Z',
                        'H','S','B','A','R','L','A','A','N','D','R',
                        'K','E','O','N','Y','A','N','E','B','A','F',
                        'B','L','C','C','V','I','R','T','E','F','E',
                        'E','A','H','E','C','G','P','R','S','J','B',
                        'D','E','F','M','Y','E','M','B','X','G','G',
                        'F','R','I','T','L','R','Y','Q','V','Z','D']; // 11x11

var inPlayVals = [ 0,0,1,1,1,1,1,1,1,1,1,
                   0,1,0,0,0,0,0,0,0,0,0,
                   0,1,0,1,0,0,0,0,0,0,0,
                   0,1,0,1,0,0,0,0,0,0,0,
                   0,1,0,1,0,0,0,0,0,1,0,
                   0,1,0,1,0,0,0,0,1,0,0,
                   0,1,0,1,0,0,0,1,0,0,0,
                   0,1,0,1,0,0,1,0,0,0,0,
                   0,1,0,1,0,1,0,0,0,0,0,
                   0,1,0,0,1,0,0,0,0,0,0,
                   0,1,0,0,0,0,0,0,0,0,0]; // 11 X 11

var tileCategories   = ['O','O','T','T','T','T','T','T','T','T','T',
                        'O','R','O','O','O','O','O','O','O','O','O',
                        'O','R','O','F','O','O','O','O','O','O','O',
                        'O','R','O','F','O','O','O','O','O','O','O',
                        'O','R','O','F','O','O','O','O','O','E','O',
                        'O','R','O','F','O','O','O','O','E','O','O',
                        'O','R','O','F','O','O','O','E','O','O','O',
                        'O','R','O','F','O','O','E','O','O','O','O',
                        'O','R','O','F','O','E','O','O','O','O','O',
                        'O','R','O','O','E','O','O','O','O','O','O',
                        'O','R','O','O','O','O','O','O','O','O','O']; // 11x11

// PubNub
var dataServer;
var pubKey = 'pub-c-492eadd3-274a-4f66-bc2b-275f441475f0';
var subKey = 'sub-c-f1fc1aa0-f805-11e8-aba4-3a82e8287a69';
var channelName = 'CrossWithFriends';

function setup(){
     canvas = createCanvas(windowWidth, windowHeight);
     canvas.style('display','block');
     canvas.parent('mcontainer'); // In html file

     // Initialize PubNub
     dataServer = new PubNub({
          publish_key : pubKey,
          subscribe_key : subKey,
          ssl : true // Enables a secure connection. Required of OCAD workspace
     });

     // Attach callbacks to the PubNub object to handle messages and connections
     dataServer.addListener({
          message: readIncoming,
          presence: whoIsConnected
     })
     dataServer.subscribe({
          channels:[channelName]
     });

     // Set gameboard sizes
     gwidth = 650;
     gheight = 650;
     maxRadius = (gwidth-border)/(totTx*2);

     // Create a grid of tiles using the Tile class
     for(var tx = 0; tx < totTx; tx++){
          for(var ty = 0; ty < totTy; ty++){
               var pVal = inPlayVals[pcounter];
               var cat = tileCategories[tcounter];
               var tileInPlay = false;
               if( pVal == 1){
                    tileInPlay = true;
               }
               tiles.push(new Tile(map(tx,0,totTx,border,gwidth-border),
                                   map(ty,0,totTy,border,gheight-border),
                                   255,255,255,mwhite,tileInPlay,false,true,cat));
               pcounter++;
               tcounter++;
          }
     }

     // Create the letters to overlay over tiles
     for(var x = 0; x < totTx; x++){
          letters[x] = []; // creating a nested array
          for(var y = 0; y < totTy; y++){
               var l = crossWithFriends[counter];
               letters[x][y] = new Letter(l,
                           map(x,0,totTx,border,gwidth-border),
                           map(y,0,totTy,border,gheight-border));
               counter++;
          }
     }

     // Generate a random color between 0 - 255 and assign to player
     pr = int(random(0,256));
     pg = int(random(0,256));
     pb = int(random(0,256));

     // Draw the lock button
     var iW = 650;
     var iH = 400;

     discoverBtn = createButton('DISCOVER');
     discoverBtn.position(iW,iH);
     discoverBtn.mousePressed(discover);
     discoverBtn.parent('mcontainer');
     discoverBtn.id('discoverBtn');
}

function draw(){
     background(200);

     // Draw the tiles
     for(var i = 0; i < tiles.length; i++){
          tiles[i].display(); // Get a tile and display it
     }

     // Draw the letters
     for(var x = 0; x < totTx; x++){
          for(var y = 0; y < totTy; y++){
               letters[x][y].display(); // Get a letter and display it
          }
     }

     // Draw the hints
     fill(0);
     textSize(50);
     textAlign(CENTER);
     text("Cross the Dragon",850,150);
     textSize(20);
     text("Find a word then click the button",850,200);
     text("to learn more about China\'s economic ",850,225);
     text("investments in these industries", 850, 250);
     text("FINANCE", 850, 275);
     text("REAL ESTATE", 850, 300);
     text("ENERGY", 850, 325);
     text("TRANSPORT", 850, 350);
}

/* Tile class */
function Tile(x,y,r,g,b,c,t,l,w,cat){
     this.x = x;
     this.y = y;
     this.r = r;
     this.g = g;
     this.b = b;
     this.c = c;
     this.size = 53; // width / height
     this.inPlay = t;
     this.isLocked = l;
     this.isWhite = w;
     this.category = cat;

     this.display = function(){
          fill(this.r, this.g, this.b);
          noStroke();
          // Draw a square tile
          rectMode(CENTER);
          rect(this.x, this.y, this.size, this.size);
     }

     this.clickCheck = function(mx,my,r,g,b){
          var d = dist(this.x,this.y, mx,my);
          if(d < (maxRadius-1)){
               if(this.isLocked){
                    // Can't change color, tile is locked
               } else {
                    // Click is within the circle - check if unlocked to change color
                    if(r==255 && g == 255 && b == 255){
                         //console.log("Setting back to white");
                    } else {
                         if(this.inPlay){
                              //console.log("In play");
                              r = 255; g = 26; b = 26;
                         } else {
                              //console.log("Not in play");
                              r = 119; g = 136; b = 153;
                         }
                    }
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    // Update this tile's color
                    this.c = r.toString() + g.toString() + b.toString();
                    //console.log("Tile is now " + this.c);
               }
          }
     }

     this.undoCheck = function(mx,my,r,g,b){
          var d = dist(this.x,this.y,mx,my);
          if(d < (maxRadius-1)){
               if(this.isLocked){
                    // Can't change color, tile is locked
               } else {
                    var tileColor = this.c;
                    if(tileColor == "255255255"){
                         // This is a normal click
                         isUndo = false;
                         //console.log("Setting isUndo to false");
                    } else {
                         // This is an undo click
                         isUndo = true;
                         //console.log("Setting isUndo to true");
                    }
               }
          }
     }

     this.lockTile = function(){
          // If the tile is in play - lock it
          if(this.inPlay){
               // Tile is locable - lock it
               // If it's color is red
               //console.log(" Your tile is " + this.c);
               if(this.c == "2552626"){
                    // Tile is red. Check tile category
                    var tileCat = this.category;
                    // console.log("Category is : " + tileCat);
                    if(tileCat == "T"){
                         catT++;
                    } else if(tileCat == "E") {
                         catE++;
                    } else if(tileCat == "R"){
                         catR++;
                    } else if(tileCat == "F"){
                         catF++;
                    } else {
                         // console.log("Oops! Check the tile categories");
                    }
                    // Remove the tile from play and lock it
                    this.inPlay = false;
                    this.isLocked = true;
               }
          } else {
               // Ignore the tile
          }
     }
}

/* Function to pass the player color to the tile's lock function and trigger the projections */
function discover(){
     lockPressed = true;
     for(var i = 0; i < tiles.length; i++){
          tiles[i].lockTile();
     }
     //console.log("Found this many T's : " + catT);
     //console.log("Found this many E's : " + catE);
     //console.log("Found this many R's : " + catR);
     //console.log("Found this many F's : " + catF);
     checkIndustries();
}

/* Function to check which complete word has been found */
function checkIndustries(){
     if(catT == 9){
          currIndustry = "Transport";
          // Reset it
          catT = 0;
          shouldStartProjection = true;
     } else if(catE == 6){
          currIndustry = "Energy";
          // Reset it
          catE = 0;
          shouldStartProjection = true;
     } else if(catR == 10){
          currIndustry = "Real Estate";
          // Reset it
          catR = 0;
          shouldStartProjection = true;
     } else if(catF == 7){
          currIndustry = "Finance";
          // Reset it
          catF = 0;
          shouldStartProjection = true;
     } else {
          currIndustry = "";
          shouldStartProjection = false;
     }
     // Start the first projection?
     if(shouldStartProjection){
          dataServer.publish({
               channel: channelName,
               message:
               {
                    i: 2, // Message indicating click positon
                    ind: currIndustry
               }
          });
     }
}

function updateLock(){
     lockPressed = true;
}

/* Letter class */
function Letter(letter,x,y){
     this.letter = letter;
     this.x = x;
     this.y = y;

     this.display = function(){
          // Draw the letter
          fill(0);
          noStroke();
          textSize(12);
          textAlign(CENTER,CENTER);
          text(this.letter, this.x, this.y);
     }
}

function mousePressed(){
     // Check whether the lock button has been clicked
     if(lockPressed){
          // console.log("Lock has been pressed");
          // Reset the lockPressed
          lockPressed = false;
     } else {
          // Check if it was an undo click
          for(var i = 0; i < tiles.length; i++){
               tiles[i].undoCheck(mouseX,mouseY,pr,pg,pb);
          }

          // Send data to server to draw it on connected screens
          // Check whether it is an undo click
          if(isUndo){
               // console.log("Undo!");
               // Tile needs to be white
               dataServer.publish({
                    channel: channelName,
                    message:
                    {
                         i: 1, // Message indicating click positon
                         x: mouseX,
                         y: mouseY,
                         r: 255,
                         g: 255,
                         b: 255
                    }
               });
               // Reset isUndo after the undo is registered
               isUndo = false;
          } else {
               //console.log("Normal click");
               dataServer.publish({
                    channel: channelName,
                    message:
                    {
                         i: 1, // Message indicating click positon
                         x: mouseX,
                         y: mouseY,
                         r: pr,
                         g: pg,
                         b: pb
                    }
               });
          }
     }
}

/* Function reads incoming messages */
function readIncoming(inMessage){
     // console.log(inMessage);
     if(inMessage.channel == channelName){
          // Check what type of message it is
          var msgId = inMessage.message.i;
          if(msgId == 1){
               // Check click
               // Get click coords & player colors
               var clickX = inMessage.message.x;
               var clickY = inMessage.message.y;
               var pR = inMessage.message.r;
               var pG = inMessage.message.g;
               var pB = inMessage.message.b;
               //console.log("You clicked at (" + clickX + "," + clickY + ")");
               for(var i = 0; i < tiles.length; i++){
                    tiles[i].clickCheck(clickX,clickY, pR,pG,pB);
               }
          } else if(msgId == 2){
               // A lock message
               updateLock();
               // Start the projection
               var projIndustry = inMessage.message.ind;
               console.log("Will start playing the video 1 for " + projIndustry);
          } else {
               //console.log("Oops! Check message id.");
          }

     }
}

function whoIsConnected(connectionInfo){}

/* Function to make the canvas resposive to the screen */
function windowResized(){
     resizeCanvas(windowWidth, windowHeight);
}
