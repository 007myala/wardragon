/*
     FIND WITH FRIENDS
     Dev: MARIa deniSE Yala
     Ver: 1.7
     Last Modified: 23 / 11 / 18

     Draws a matrix of clickable tiles
     onto the canvas, changes their colors based on a player id
     allows players to 'steal' each others tiles or 'lock' their tiles
     when tiles are locked a score is calculated

     This code was created with help/reference from examples by Nick Puckett & Kate Hartman
     from the Creation & Computation - Digital Futures, OCAD University
*/

var canvas;
var tiles = []; // An array to hold the square tiles
var letters = []; // A nested array to hold letters
var totTx = 15; // Total number of tiles to create in the x direction
var totTy = 15; // Total number of tiles to create in the y direction
var border = 30;
// var test = ['A','P','J','X','E','I','C','O','W']; // 3 x 3
/* var test = ['U','G','D','J','R','E','X',
            'W','X','S','U','N','C','N',
            'C','Y','N','J','F','C','V',
            'F','E','U','N','D','F','B',
            'Y','G','E','B','I','S','O',
            'U','G','E','I','N','O','N',
            'M','X','Y','G','O','M','E']; // 7 x 7 */
var whoHasTrumpOffended = ['K','M','S','H','I','S','T','O','R','I','A','N','S','O','A',
                           'D','E','L','B','A','S','I','D','K','D','K','W','S','H','L',
                           'R','X','B','M','V','A','F','U','Y','U','F','P','Z','S','J',
                           'R','Z','U','E','S','Z','D','A','F','L','Y','R','H','C','C',
                           'E','X','S','X','T','W','L','C','F','G','R','E','U','I','S',
                           'A','O','M','I','N','P','O','Y','A','B','A','S','M','E','U',
                           'G','T','I','C','A','S','M','M','M','T','T','S','A','N','H',
                           'A','L','L','A','R','R','K','E','E','D','I','A','N','T','C',
                           'N','F','S','N','G','K','R','C','U','N','L','Z','I','I','X',
                           'I','E','U','S','I','T','O','F','A','Y','I','V','T','S','J',
                           'T','N','M','Y','M','A','R','M','B','L','M','A','Y','T','O',
                           'E','G','H','R','M','S','L','C','Q','O','B','P','V','S','V',
                           'S','W','X','W','I','D','A','Y','P','W','D','E','R','L','H',
                           'U','T','O','U','V','I','P','O','V','K','X','W','H','Q','J',
                           'O','B','N','M','A','U','F','Y','Z','Q','R','N','T','T','X']; // 15 X 15

var ptiles = [ 0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,
               2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,
               0,0,0,1,0,0,0,0,0,0,0,1,0,1,0,
               1,0,0,1,2,0,0,0,0,1,2,1,2,1,0,
               1,0,2,1,2,3,0,0,0,1,2,1,2,1,0,
               1,0,2,1,2,0,3,0,0,1,2,1,2,1,0,
               1,0,2,1,2,3,0,3,0,1,2,1,2,1,0,
               1,0,2,1,2,0,3,0,3,0,2,0,2,1,0,
               1,0,2,1,2,0,0,3,0,3,2,0,2,1,0,
               1,0,2,1,2,0,0,0,3,0,2,0,2,1,0,
               1,0,2,0,2,0,0,0,0,3,2,0,2,1,0,
               1,0,0,0,2,0,0,0,0,0,3,0,0,1,0,
               1,0,0,0,2,0,0,0,0,0,0,3,0,0,0,
               0,0,0,0,0,0,0,0,0,0,0,0,3,0,0,
               0,0,0,0,0,0,0,0,0,0,0,0,0,3,0]; // 15 X 15
var players = []; // array of players
var counter = 0;
var pcounter = 0;
var score = 0;
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
               var pt = ptiles[pcounter];
               // console.log("Point : " + pt);
               // Map function - val to map, min, max, min val to map to, max val to map to
               // Pass the color white rgb vals and also color id
               // New tile so set isLocked to false, set isWhite to true
               tiles.push(new Tile(map(tx,0,totTx,border,gwidth-border),
                                   map(ty,0,totTy,border,gheight-border),
                                   255,255,255,white,false,true,pt));
               pcounter++;
          }
     }

     // Create the letters to overlay over tiles
     for(var x = 0; x < totTx; x++){
          letters[x] = []; // creating a nested array
          for(var y = 0; y < totTy; y++){
               var l = whoHasTrumpOffended[counter];
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
     lockButton = createButton('LOCK TILES');
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
     textSize(20);
     text("FindWithFriends", 700, 25);
     textSize(12);
     text("Who Has Trump Offended?", 700, 60);
     textSize(8);
     text("Source - HuffingtonPost", 700, 75);
     fill(255);
     textSize(12);
     text("HISTORIANS", 700,100);
     text("DISABLED", 700,125);
     text("WOMEN", 700,150);
     text("SCIENTISTS", 700,175);
     text("LGBT",700,200);
     text("MEXICANS",700,225);
     text("'THE BLACKS'",700,250);
     text("IMMIGRANTS",700,275);
     text("PRESS",700,300);
     text("MUSLIMS",700,325);
     text("REAGANITES",700,350);
     text("*SUPER SECRET WORD*",700,375);
     textSize(16);
     text("YOUR SCORE:",700,500);
     textSize(80);
     fill(pr, pg, pb);
     text(score, 700, 560);
};

/* Tile class */
function Tile(x,y,r,g,b,c,l,w,p){
     this.x = x;
     this.y = y;
     this.size = 40; // width / height
     this.r = r;
     this.g = g;
     this.b = b;
     this.c = c; // A string for the color as id
     this.isLocked = l;
     this.isWhite = w;
     this.p = p; // The tiles points;

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
               var tpoint = this.p;
               score += tpoint;
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
