/*
     FIND WITH FRIENDS
     Dev: MARIa deniSE Yala
     Ver: 1.3
     Last Modified: 21 / 11 / 18

     Draws a matrix of clickable tiles
     onto the canvas, changes their colors based on a player

     This code was created with help/reference from examples by Nick Puckett & Kate Hartman
     from the Creation & Computation - Digital Futures, OCAD University
*/

var canvas;
var tiles = []; // An array to hold the square tiles
var letters = []; // A nested array to hold letters
var totTx = 7; // Total number of tiles to create in the x direction
var totTy = 7; // Total number of tiles to create in the y direction
var border = 50;
// var test = ['A','P','J','X','E','I','C','O','W']; // 3 x 3
var test = ['U','G','D','J','R','E','X',
            'W','X','S','U','N','C','N',
            'C','Y','N','J','F','C','V',
            'F','E','U','N','D','F','B',
            'Y','G','E','B','I','S','O',
            'U','G','E','I','N','O','N',
            'M','X','Y','G','O','M','E']; // 7 x 7
var counter = 0;
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

function setup(){
     createCanvas(600,600);

     maxRadius = (width-border)/(totTx*2);

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
               tiles.push(new Tile(map(tx,0,totTx,border,width-border),
                                   map(ty,0,totTy,border,height-border),
                                   255,255,255,white,false,true));
          }
     }

     // Create the letters to overlay over tiles
     for(var x = 0; x < totTx; x++){
          letters[x] = []; // creating a nested array
          for(var y = 0; y < totTy; y++){
               var l = test[counter];
               letters[x][y] = new Letter(l,map(x,0,totTx,border,width-border), map(y,0,totTy,border,height-border));
               counter++;
          }
     }

     // Generate a random color between 0 - 255 and assign to player
     pr = int(random(0,256));
     pg = int(random(0,256));
     pb = int(random(0,256));
     pid = pr.toString() + pg.toString() + pb.toString(); // white is 255255255
     console.log("Player ID: " + pid);
     frameRate(2);
};

function draw(){
     background(0);

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
};

function Tile(x,y,r,g,b,c,l,w){
     this.x = x;
     this.y = y;
     this.size = 80; // width / height 100 x 100 dimensions
     this.r = r;
     this.g = g;
     this.b = b;
     this.c = c; // A string for the color as id
     this.isLocked = l;
     this.isWhite = w;

     this.display = function(){
          fill(this.r,this.g,this.b);
          noStroke();
          // draw a circle
          rectMode(CENTER);
          rect(this.x, this.y, this.size, this.size);
          //ellipse(this.x, this.y, this.size, this.size);
          //console.log(this.x);
          //console.log(this.y);
          //console.log("");
     }

     // Check whether the circle has been clicked and change it's color
     this.clickCheck = function(mx,my,r,g,b){
          var d = dist(this.x,this.y,mx,my);
          if(d < (maxRadius-1)){
               // Click is within the circle - check if it's white
               if(this.isWhite){
                    // Make tile the player's color
                    console.log("Tile is white");
                    this.r = r;
                    this.g = g;
                    this.b = b;
                    // Color changed - update this isWhite
                    this.isWhite = false;
               } else {
                    // Tile is not white - already clicked
                    console.log("Tile's not white!");
                    // Check if tile is locked
                    if(this.isLocked){
                         // Color can't be changed
                         console.log("Tile is locked!");
                    } else {
                         // Tile hasn't been locked
                         // Who's clicking? compare color ids - If same player is clicking make it white else switch to other player
                         if(pid == who){
                              /* this.r = 255;
                              this.g = 255;
                              this.b = 255;
                              this.isWhite = true;*/
                         } else {
                              this.r = r;
                              this.g = g;
                              this.b = b;
                              console.log("Friend is stealing tile!");
                         }
                    }
               }
          }
     }
}

function Letter(letter,x,y){
     this.letter = letter;
     this.x = x;
     this.y = y;

     this.display = function(){
          // draw the letter
          fill(0);
          noStroke();
          textSize(25);
          textAlign(CENTER,CENTER);
          text(this.letter, this.x, this.y);
     }
}

function mouseClicked(){
     // Check if mouse is inside the circle for each tiles
     for(var i = 0; i < tiles.length; i++){
          tiles[i].clickCheck(mouseX,mouseY,pr,pg,pb);
     }

     // Send data to the server to draw it on other screens
     dataServer.publish({
          channel: channelName,
          message:
               {
                    x : mouseX,
                    y : mouseY,
                    r : pr,
                    g : pg,
                    b : pb,
                    id : pid
               }
     });
}

function readIncoming(inMessage){
     console.log(inMessage);
     if(inMessage.channel == channelName){
          // Get click coords & player colors
          var clickX = inMessage.message.x;
          var clickY = inMessage.message.y;
          var pR = inMessage.message.r;
          var pG = inMessage.message.g;
          var pB = inMessage.message.b;
          // Update who is clicking
          who = inMessage.message.id;
          for (var i = 0; i < tiles.length; i++){
               tiles[i].clickCheck(clickX,clickY,pR,pG,pB);
          }
     }
}

function whoIsConnected(connectionInfo){}

/*
     REFERENCES
     https://github.com/DigitalFuturesOCADU/CC18/blob/master/Experiment%204/P5/pubnub/06A_LOCAL_ONLYcommonCanvas_animSpeed_inertia/sketch.js
     https://randomcolor.lllllllllllllllll.com/
     http://nikolay.rocks/2015-10-29-rainbows-generator-in-javascript
     https://p5js.org/examples/color-color-variables.html
*/
