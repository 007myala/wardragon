/*
     CROSS THE DRAGON
     Team: Norbert Zhao, Alicia Blakey, and Maria Yala
     Ver: 1.0
     Last Modified: 23 / 30 / 18

     Cross the dragon - combines the interactions from Maria Yala's FindWithFriends
     & Alicia Blakey's Soundbeats & Heartbeats.

     This code was created with help/reference from examples by Nick Puckett & Kate Hartman
     from the Creation & Computation - Digital Futures, OCAD University
*/

var canvas;
var tiles = []; // An array to hold the square tiles
var letters = []; // A nested array to hold letters
var totTx = 11; // Total number of tiles to create in the x direction
var totTy = 11; // Total number of tiles to create in the y direction
var border = 40;
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
                        'F','R','I','T','L','R','Y','Q','V','Z','D']; // 10x10

var players = []; // array of players
var counter = 0;
var pcounter = 0;

var maxRadius; // Sets the radius of each circle according to canvas width
var pr,pg,pb; // Random color of each player - var for the red blue green color channels
var pid; // An id for the player
var who; // A var to hold who is clicking
var white = "255255255";
var dataServer;
var pubKey = 'pub-c-b44da511-8d9d-4d62-8ef9-cf94247b6dc5';
var subKey = 'sub-c-a350389e-edad-11e8-b4c2-46cd67be4fbe';
var channelName = 'FindWithFriends';
var numConnections;
var isUndo = false;
var lockButton;
var lockPressed = false;

function setup(){
     canvas = createCanvas(windowWidth, windowHeight);
     canvas.style('display','block');
     canvas.parent('mcontainer'); // In html file

     gwidth = 650;
     gheight = 650;
     maxRadius = (gwidth-border)/(totTx*2);

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

     // Create a grid of tiles using the Tile class
     for(var tx = 0; tx < totTx; tx++){
          for(var ty = 0; ty < totTy; ty++){
               // Map function - val to map, min, max, min val to map to, max val to map to
               // Pass the color white rgb vals and also color id
               // New tile so set isLocked to false, set isWhite to true
               tiles.push(new Tile(map(tx,0,totTx,border,gwidth-border),
                                   map(ty,0,totTy,border,gheight-border),
                                   255,255,255,white,false,true));
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
     pid = pr.toString() + pg.toString() + pb.toString(); // white is 255255255
     // console.log("Player ID: " + pid);

     // Draw the lock button
     var iW = 650;
     var iH = 400;
     lockButton = createButton('DISCOVER');
     lockButton.position(iW,iH);
     lockButton.mousePressed(lock);
     lockButton.parent('mcontainer');
     lockButton.id('lockBtn');
};

function draw(){
     background(20);

     // Draw the tiles
     for( var i = 0; i < tiles.length; i++){
          tiles[i].display(); // Get a tile and display it.
     }

     // Draw the letters
     for( var x = 0; x < totTx; x++){
          for( var y = 0; y < totTy; y++){
               letters[x][y].display(); // Get a letter and display it
          }
     }

     // Draw the hints

     fill(255,0,0);
     textSize(30);
     textAlign(LEFT);
     text("Cross The Dragon", 650, 50);
     textSize(20);
     fill(255);
     text("E N E R G Y", 650,125);
     text("F I N A N C E", 650,150);
     text("R E A L  E S T A T E", 650,175);
     text("T R A N S P O R T", 650,200);
};

/* Tile class */
function Tile(x,y,r,g,b,c,l,w){
     this.x = x;
     this.y = y;
     this.size = 55; // width / height
     this.r = r;
     this.g = g;
     this.b = b;
     this.c = c; // A string for the color as id
     this.isLocked = l;
     this.isWhite = w;

     this.display = function(){
          fill(this.r,this.g,this.b);
          noStroke();
          //stroke(0);
          // draw a square tile
          rectMode(CENTER);
          rect(this.x, this.y, this.size, this.size);
          //console.log(this.x);
          //console.log(this.y);
          //console.log("");
     }

     this.clickCheck = function(mx,my,r,g,b){
          var d = dist(this.x,this.y,mx,my);
          if(d < (maxRadius-1)){
               // Click is within the circle - check if unlocked to change color
               if(this.isLocked){
                    // Can't change color, tile is locked
               } else {
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    // Update the tile's color
                    this.c = r.toString() + g.toString() + b.toString();
                    // console.log("Tile is now " + this.c);
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
                    var clickColor = r.toString() + g.toString() + b.toString();
                    if(tileColor == clickColor){
                         // This is an undo click
                         isUndo = true;
                         // console.log("Setting isUndo to true");
                    } else {
                         // This is a normal click
                         isUndo = false;
                         // console.log("Setting isUndo to false");
                    }
               }
          }
     }

     /* Lock all of a players tiles to prevent stealing */
     this.lockTile = function(id){
          // If player's id color matches the tiles id color, lock it
          if(this.c == id){
               this.isLocked = true;
               // Update the players score
               //var tpoint = this.p;
               //score += tpoint;
               // console.log("Point : " + tpoint);
               console.log("Score is now: " + score);
               // Send a message to update other player's screens.
               console.log("Updating lock");
               pubLock(this.x, this.y, this.r, this.g, this.b, 1);
          } else {
               this.isLocked = false;
          }
     }

     /* Lock all of a players tiles to prevent stealing */
     this.updateLockTile = function(id){
          // If player's id color matches the tiles id color, lock it
          if(this.c == id){
               this.isLocked = true;
               // console.log("Color match");
               // console.log("color : " + this.c + " ID: " + id );
          } else {
               this.isLocked = false;
          }
     }
}

/* Function to pass the player color to the tile's lock function */
function lock(){
     lockPressed = true;
     // Reset the score and count again
     score = 0;
     for(var i = 0; i < tiles.length; i++){
          tiles[i].lockTile(pid);
     }
     // Score updated - update other players
}

/* Function to update the locked tiles */
function updateLock(p){
     lockPressed = true;
     for(var i = 0; i < tiles.length; i++){
          tiles[i].updateLockTile(p);
     }
}

/* Function to publish a message indicating a lock has occured */
function pubLock(lx,ly,lr,lg,lb,lId){
     dataServer.publish({
          channel: channelName,
          message:
               {
                    x : lx,
                    y : ly,
                    r : lr,
                    g : lg,
                    b : lb,
                    id : pid,
                    l : lId
               }
     });
}

/* Letter class */
function Letter(letter,x,y){
     this.letter = letter;
     this.x = x;
     this.y = y;

     this.display = function(){
          // draw the letter
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
          // console.log("Lock not pressed");
          // Check if the click was an undo click by comparing tile color to player color
          for(var i = 0; i < tiles.length; i++){
               tiles[i].undoCheck(mouseX,mouseY,pr,pg,pb);
          }

          // Send data to the server to draw it on other screens
          // Check whether it is an undo click
          if(isUndo){
               // console.log("Undo!");
               // Tile needs to be white
               dataServer.publish({
                    channel: channelName,
                    message:
                         {
                              x : mouseX,
                              y : mouseY,
                              r : 255,
                              g : 255,
                              b : 255,
                              id : pid,
                              l : 0
                         }
               });
               // Reset isUndo after the undo is registered
               isUndo = false;
          } else {
               // console.log("Normal click");
               dataServer.publish({
                    channel: channelName,
                    message:
                         {
                              x : mouseX,
                              y : mouseY,
                              r : pr,
                              g : pg,
                              b : pb,
                              id : pid,
                              l : 0
                         }
               });
          }
     }
}

/* Function reads incoming messages - determines whether it is normal click or a lock message */
function readIncoming(inMessage){
     // console.log(inMessage);
     if(inMessage.channel == channelName){
          // Get click coords & player colors
          var clickX = inMessage.message.x;
          var clickY = inMessage.message.y;
          var pR = inMessage.message.r;
          var pG = inMessage.message.g;
          var pB = inMessage.message.b;
          // Update who is clicking
          who = inMessage.message.id;

          var lId = inMessage.message.l;
          if(lId == 0){
               // Not an lock message
               // console.log("Not a lock message");
               for (var i = 0; i < tiles.length; i++){
                    tiles[i].clickCheck(clickX,clickY,pR,pG,pB);
               }
          } else if(lId == 1){
               // A lock message
               // console.log("Lock tiles for ID " + who);
               updateLock(who);
          } else {
               // console.log("Something wrong with lock id. Not 0 not 1");
          }
     }
}

function whoIsConnected(connectionInfo){}

/* Function to make the canvas responsive to the screen */
function windowResized(){
     resizeCanvas(windowWidth, windowHeight);
}

/*
     REFERENCES
     https://github.com/DigitalFuturesOCADU/CC18/blob/master/Experiment%204/P5/pubnub/06A_LOCAL_ONLYcommonCanvas_animSpeed_inertia/sketch.js
     https://randomcolor.lllllllllllllllll.com/
     http://nikolay.rocks/2015-10-29-rainbows-generator-in-javascript
     https://p5js.org/examples/color-color-variables.html
     https://stackoverflow.com/questions/42101752/styling-buttons-in-javascript
     https://p5js.org/reference/#/p5.Element/parent
*/
