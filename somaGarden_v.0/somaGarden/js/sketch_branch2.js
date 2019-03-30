/*
 * Learning PoseNet - Sketch draws a clown nose and black dot over one's left eye
 * Code written following tutuorial by The Coding Train by Daniel Shiffman at https://youtu.be/EA3-k9mnLHs
 */
var canvas;
let video;
let poseNet;
let poses = [];
let skeletons = [];
var angle = 0;
var slider; // start, stop, step-size
var tree = [];
var leaves = [];
var count = 0;
var theta1 = 0;
var theta2 = 0;
var xpos;
var ypos;

function setup(){
    canvas = createCanvas(700,480);
    slider = createSlider(0, TWO_PI, PI/4, 0.01);

    video = createCapture(VIDEO);
    poseNet = ml5.poseNet(video, modelReady); // Load the poseNet model
    poseNet.on('pose', function(results) {
        poses = results;
    });
    video.hide();
}

/* Function callback for when ml5 successfully opens */
function modelReady(){
    //console.log(ml5);
    //console.log('model ready');
}

function draw(){
    background(100);
    angle = slider.value();
    image(video,0,0);

    stroke(255);
    strokeWeight(2);
    translate(300,height);
    branch(100);

    // Draw all the keypoints and the skeletons
    drawKeypoints();
    drawSkeleton();

}

function branch(len){
    // draw the trunk
    line(0, 0, 0, - len);
    translate(0, -len);
    if (len > 4){
        // draw the left and right branches
        push(); // save the transformation state
        rotate(angle);
        branch(len*0.67);
        pop(); // restore the state
        push();
        rotate(-angle);
        branch(len*0.67);
        pop();
    }
}

function drawKeypoints(){
    // Loop through all the poses detected
    for (let i = 0; i < poses.length; i++){
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < poses[i].pose.keypoints.length; j++){
            let keypoint = poses[i].pose.keypoints[j];
            // Only draw an ellipse if the pose probability is bigger than 0.2
            if (keypoint.score > 0.2){
                fill(255, 0, 0);
                noStroke();
                ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
            }
        }
    }
}

function drawSkeleton(){
    // Loop through all the skeletons detected
    for(let i = 0; i < poses.length; i++){
        // For every skeleton, loop through all body connections
        for(let j = 0; j < poses[i].skeleton.length; j++) {
            let partA = poses[i].skeleton[j][0];
            let partB = poses[i].skeleton[j][1];
            stroke(255,0,0);
            line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
        }
    }
}

function windowResized(){
    //resizeCanvas(windowWidth,windowHeight);
}
