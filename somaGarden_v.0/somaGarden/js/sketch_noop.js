/*
 * Learning PoseNet - Sketch draws a clown nose and black dot over one's left eye
 * Code written following tutuorial by The Coding Train by Daniel Shiffman at https://youtu.be/EA3-k9mnLHs
 */
var canvas;
let video;
let poseNet;
let poses = [];
let skeletons = [];

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


let xdir; // Vector direction indicator
// Left side

var angle = 0; // angle in radians
var apitR = 0;
var apitL = 0;

function setup(){
    canvas = createCanvas(windowWidth, windowHeight);
    video = createCapture(VIDEO);
    video.size(640,480);
    val = width/2;
    poseNet = ml5.poseNet(video, modelReady); // Load the poseNet model
    poseNet.on('pose', gotPoses);
    video.hide();
    video.loop();
    //video.volume(0);
}

/* Function callback for when ml5 successfully opens */
function modelReady(){
    //console.log(ml5);
    //console.log('model ready');
}

/* Reference: http://p5js.org/reference/#/p5.Vector/angleBetween */
function draw(){
    background(255);

    // Create point vectors for the right side shoulder, wrist and hip.
    var p0 = createVector(rShoulderX, rShoulderY);
    var p1 = createVector(rHipX,rHipY);
    var p2 = createVector(rWristX, rWristY);

    // Create point vectors for the left side shoulder, wrist and hip
    var p3 = createVector(lShoulderX, lShoulderY);
    var p4 = createVector(lHipX,lHipY);
    var p5 = createVector(lWristX, lWristY);


    var v1 = createVector(p1.x-p0.x, p1.y-p0.y);
    var v2 = createVector(p2.x-p0.x, p2.y-p0.y);

    var v3 = createVector(p4.x-p3.x, p4.y-p3.y);
    var v4 = createVector(p5.x-p3.x, p5.y-p3.y);

    drawArrow(p0,v1,'red');
    drawArrow(p0,v2,'blue');
    drawArrow(p3,v3,'green');
    drawArrow(p3,v4,'yellow');

    // check the direction
    // TODO xdir =

    // draw markers
    fill(0, 0, 0);
    // ellipse(noseX, noseY, 10, 10);
    ellipse(rWristX, rWristY, 10, 10);
    ellipse(rShoulderX, rShoulderY, 15, 15);
    ellipse(rHipX, rHipY, 20, 20);

    fill(0, 255, 0);
    ellipse(lWristX, lWristY, 10, 10);
    ellipse(lShoulderX, lShoulderY, 15, 15);
    ellipse(lHipX, lHipY, 20, 20);

    let angleBetween = v1.angleBetween(v2);
    let angleBetween0 = v3.angleBetween(v4);

    // Update the angle
    var NAngle = angleBetween.toFixed(2);
    var NAngle0 = angleBetween0.toFixed(2);

    // Map function - val to map, min, max, min val to map to, max val to map to
    apitR = map(NAngle, 0, TWO_PI, 0, 1);
    apitL = map(NAngle0, 0, TWO_PI, 0, 1);

    noStroke();
    textSize(20);
    text('Branches' + branches,10, 50, 150, 90);

    // draw the tree
    stroke(0);
    strokeWeight(5);
    translate(width/2,height);
    branch(150);
}

function branch(len){
    // draw the trunk
    line(0, 0, 0, - len);
    translate(0, -len);
    if (len > 4){
        // draw the left and right branches
        push(); // save the transformation state
        rotate(apitR);
        //rotate(PI/4);
        branch(len*0.67);
        pop(); // restore the state
        push();
        rotate(-apitL);
        //rotate(-PI/6);
        branch(len*0.67);
        pop();
    }
}

/* Function callback for when a pose is detected
   prints out an array of all the pose information to the console
 */
function gotPoses(poses){
    //console.log(poses);
    /* Track nose when atleast one pose is detected */
    if(poses.length > 0 ){
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
/*
        // Create point vectors for start and end points
        var a = createVector(wX,wY); // wrist v0
        var b = createVector(sX,sY); // shoulder v1
        var c = createVector(hX,hY); // hip v2
        drawArrow(a,b,'red');
        drawArrow(a,c,'blue');
        // Create the direction vectors
        var ab = p5.Vector.sub(b, a);
        var cb = p5.Vector.sub(b, c);

        theta1 = atan2(cb.y - ab.y, cb.x - ab.x);
        theta1 = p5.Vector.angleBetween(ab,cb);
        print(degrees(theta1));*/
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
    //resizeCanvas(windowWidth,windowHeight);
}
