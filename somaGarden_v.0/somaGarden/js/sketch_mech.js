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

let rWristX = 0; // Start lerp positions
let rWristY = 0;
let rShoulderX = 0;
let rShoulderY = 0;
let rHipX = 0;
let rHipY = 0;
let noseX = 0;
let noseY = 0; // End lerp positions

let lWristX = 0; // Start lerp positions
let lWristY = 0;
let lShoulderX = 0;
let lShoulderY = 0;
let lHipX = 0;
let lHipY = 0; // End lerp positions

let wX; // Start keypoint data
let wY;
let sX;
let sY;
let hX;
let hY;
let nX;
let nY; // End keypoint data

let wlX; // Start keypoint data
let wlY;
let slX;
let slY;
let hlX;
let hlY; // End keypoint data

// Left side
var apitR;
var apitL;

let foundPose = false;

function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.style('display','block');

    angle = PI/6;
    video = createCapture(VIDEO);
    video.size(640,480);
    poseNet = ml5.poseNet(video, modelReady); // Load the poseNet model
    poseNet.on('pose', gotPoses);
    video.hide();
    video.loop();

    apitR = PI/4;
    apitL = PI/6;

    makeTree();
}

function makeTree(){
    // create point vectors
    var a = createVector(width/2, height);
    var b = createVector(width/2, height-200);

    var root = new Branch(a,b,bSize,angle, 0);
    tree[0] = root;

    for(var i = 0; i <= 7; i++){
         makeBranches();
    }
}

function emptyTree(){
     tree = [];
     leaves = [];
     count = 0;
     bSize = 10;
     depth = 0;
}

function makeBranches(){
     for(var i = tree.length - 1; i >= 0; i--){
          if (!tree[i].finished){
               tree.push(tree[i].branchR(bSize,apitR));
               tree.push(tree[i].branchL(bSize,apitL));
          }
          tree[i].finished = true;
          bSize = bSize-1;
     }

     count++;

     if(count === 8){
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

/* Reference: http://p5js.org/reference/#/p5.Vector/angleBetween */
function draw(){
    background(255);

    // image(spaceBg, 0, 0, width, height);

    var aR = degrees(apitR).toFixed(2);
    var aL = degrees(apitL).toFixed(2);

    if(aR >= 20 && aL >= 20 ){
         // Release birds
         // background(0);
    } else if((aR >= 10 && aR < 20) && (aL >= 10 && aL < 20)){
         // background(0,255,0);
    } else {
         // background(255);
    }

    getPitRAngle();
    getPitLAngle();

    // empty tree list
    emptyTree();
    // redraw the tree with new angle
    makeTree();

    for (var i = 0; i < tree.length; i++){
         tree[i].show();
         //tree[i].jitter();
    }

    for (var i = 0; i < leaves.length; i++){
         fill(0,128,0, 100);
         // fill(255, 255, 255, 100);
         noStroke();
         ellipse(leaves[i].x, leaves[i].y, 15, 15);
         // leaves[i].y += random(0, 1); // drop the leaves --- simulate life death
         // leaves[i].x += random(-5,5); // shake leaves
         // tree[i].jitter();
    }

    // earth crust
    fill(0);
    // fill(255);
    // arc (x, y, w, h, start, stop, [mode]) - xywh give the bounding box, start - stop angles
    ellipseMode(CENTER);
    ellipse(width/2, height/2, 200, 200);
    // hill
    // fill(0,255,255);
    // triangle(width/2 - 100, 3*height/4, width/2 + 40, 3*height/4, width/2 - 50, 3*height/4 - 250);
    fill(255,0,0);
    arc(width/2, height/2, 125, 75, 0, PI); // bottom
    arc(width/2, height/2, 125, 75, PI, TWO_PI); // top
}

function getPitRAngle(){
     // Create point vectors for the right side shoulder, wrist and hip.
     var p0 = createVector(rShoulderX, rShoulderY);
     var p1 = createVector(rHipX,rHipY);
     var p2 = createVector(rWristX, rWristY);

     var v1 = createVector(p1.x-p0.x, p1.y-p0.y);
     var v2 = createVector(p2.x-p0.x, p2.y-p0.y);

     var angleBetween = v1.angleBetween(v2);
     var NAngle = angleBetween.toFixed(2);

     // Map function - val to map, min, max, min val to map to, max val to map to
     if(foundPose){
          apitR = map(NAngle, 0, TWO_PI, 0, 1);
     } else {
          apitR = PI/4;
     }
}

function getPitLAngle(){
     // Create point vectors for the left side shoulder, wrist and hip
     var p3 = createVector(lShoulderX, lShoulderY);
     var p4 = createVector(lHipX,lHipY);
     var p5 = createVector(lWristX, lWristY);

     var v3 = createVector(p4.x-p3.x, p4.y-p3.y);
     var v4 = createVector(p5.x-p3.x, p5.y-p3.y);

     // drawArrow(p3,v3,'green');
     // drawArrow(p3,v4,'yellow');

     var angleBetween0 = v3.angleBetween(v4);
     var NAngle0 = angleBetween0.toFixed(2);

     if(foundPose){
          apitL = map(NAngle0, 0, TWO_PI, 0, 1);
     } else {
          apitL = PI/6;
     }

}

/* Function callback for when a pose is detected
   prints out an array of all the pose information to the console
 */
function gotPoses(poses){
    //console.log(poses);
    /* Track nose when atleast one pose is detected */
    if(poses.length > 0 ){
        foundPose = true;
        // right Side
        wX = poses[0].pose.keypoints[10].position.x;
        wY = poses[0].pose.keypoints[10].position.y;
        sX = poses[0].pose.keypoints[6].position.x;
        sY = poses[0].pose.keypoints[6].position.y;
        hX = poses[0].pose.keypoints[12].position.x;
        hY = poses[0].pose.keypoints[12].position.y;
        nX = poses[0].pose.keypoints[0].position.x;
        nY = poses[0].pose.keypoints[0].position.y;
        rWristX = lerp(rWristX, wX, 0.5);
        rWristY = lerp(rWristY, wY, 0.5);
        rShoulderX = lerp(rShoulderX, sX, 0.5);
        rShoulderY = lerp(rShoulderY, sY, 0.5);
        rHipX = lerp(rHipX, hX, 0.5);
        rHipY = lerp(rHipY, hY, 0.5);
        noseX = lerp(noseX, nX, 0.5);
        noseY = lerp(noseY, nY, 0.5);

        // Left side
        wlX = poses[0].pose.keypoints[9].position.x;
        wlY = poses[0].pose.keypoints[9].position.y;
        slX = poses[0].pose.keypoints[5].position.x;
        slY = poses[0].pose.keypoints[5].position.y;
        hlX = poses[0].pose.keypoints[11].position.x;
        hlY = poses[0].pose.keypoints[11].position.y;

        lWristX = lerp(lWristX, wlX, 0.5);
        lWristY = lerp(lWristY, wlY, 0.5);
        lShoulderX = lerp(lShoulderX, slX, 0.5);
        lShoulderY = lerp(lShoulderY, slY, 0.5);
        lHipX = lerp(lHipX, hlX, 0.5);
        lHipY = lerp(lHipY, hlY, 0.5);
   } else {
        foundPose = false;
   }
}

// draw an arrow for a vector at a given base position
function drawArrow(base, vec, myColor) {
     push();
     stroke(myColor);
     strokeWeight(3);
     fill(myColor);
     translate(base.x, base.y);
     line(0, 0, vec.x, vec.y);
     rotate(vec.heading());
     let arrowSize = 7;
     translate(vec.mag() - arrowSize, 0);
     triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
     pop();
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
}
