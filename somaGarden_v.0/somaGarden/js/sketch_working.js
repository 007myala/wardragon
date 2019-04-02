/*
 * soma Garden
 * Code written following tutuorial by The Coding Train by Daniel Shiffman at https://youtu.be/EA3-k9mnLHs
 */
var canvas;
let video;
let poseNet;
let poses = [];
let skeletons = [];

var tree = [];
var leaves = [];
var count = 0;
var bSize = 10;

var angle = 0;
var slider; // start, stop, step-size

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.style('display','block');
    slider = createSlider(0, TWO_PI, PI/4, 0.01);
    angle = PI/6;

    makeTree();
}

function makeTree(){
    // create point vectors
    var a = createVector(width/2, height);
    var b = createVector(width/2, height-200);

    var root = new Branch(a,b,bSize,angle);
    tree[0] = root;

    for(var i = 0; i <= 4; i++){
         makeBranches();
    }
}

function emptyTree(){
     tree = [];
     leaves = [];
     count = 0;
     bSize = 10;
}

function makeBranches(){
     for(var i = tree.length - 1; i >= 0; i--){
          if (!tree[i].finished){
               tree.push(tree[i].branchR(bSize,angle));
               tree.push(tree[i].branchL(bSize,angle));
          }
          tree[i].finished = true;
          bSize = bSize-1;
     }

     count++;

     if(count === 5){
          for (var i = 0; i < tree.length; i++){
               if(!tree[i].finished){
                    var leaf = tree[i].end.copy();
                    leaves.push(leaf);
               }
          }
     }
}

/* Function callback for when ml5 successfully opens */
function modelReady(){
    //console.log(ml5);
    //console.log('model ready');
}

function draw(){
    background(51);
    angle = slider.value();
    // empty tree list
    emptyTree();
    // redraw the tree with new angle
    makeTree();

    for (var i = 0; i < tree.length; i++){
         tree[i].show();
         //tree[i].jitter();
    }

    for (var i = 0; i < leaves.length; i++){
         fill(255,0,0, 100);
         noStroke();
         ellipse(leaves[i].x, leaves[i].y, 15, 15);
         // leaves[i].y += random(0, 1); // drop the leaves --- simulate life death
         // leaves[i].x += random(-5,5); // shake leaves
         // tree[i].jitter();
    }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}
