/*
     FIND WITH FRIENDS
     Dev: MARIa deniSE Yala
     Ver: 1.0
     Last Modified: 21 / 11 / 18

     Draws a matrix of clickable tiles
     onto the canvas

     This code was created with help/reference from examples by Nick Puckett & Kate Hartman
     from the Creation & Computation - Digital Futures, OCAD University
*/

var canvas;
var tiles = []; // An array to hold the square tiles
var letters = []; // A nested array to hold letters
var totTx = 3; // Total number of tiles to create in the x direction
var totTy = 3; // Total number of tiles to create in the y direction
var border = 50;
var test = ['A','P','J','X','E','I','C','O','W'];
var counter = 0;
var pcolor; // a random color for the player

function setup(){
     createCanvas(600,600);
     // Create a grid of tiles using the Tile class
     for(var tx = 0; tx < totTx; tx++){
          for(var ty = 0; ty < totTy; ty++){
               // Map function
               /* val to map, min, max, min val to map to, max val to map to*/
               tiles.push(new Tile(map(tx,0,totTx,border,width-border), map(ty,0,totTy,border,height-border)));
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

function Tile(x,y){
     this.x = x;
     this.y = y;
     this.size = 100; // width / height 100 x 100 dimensions

     this.display = function(){
          fill(255);
          stroke(100);
          // draw a circle
          //rectMode(CENTER,CENTER);
          //rect(this.x, this.y, this.size, this.size);
          ellipse(this.x, this.y, this.size, this.size);
          //console.log(this.x);
          //console.log(this.y);
          //console.log("");
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
