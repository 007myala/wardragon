/*
 * Learning PoseNet - Sketch draws a clown nose and black dot over one's left eye
 * Code written following tutuorial by The Coding Train by Daniel Shiffman at https://youtu.be/EA3-k9mnLHs
 */ 
var canvas;
let video;
let poseNet;
let noseX = 0;
let noseY = 0;
let eyelX = 0;
let eyelY = 0;

function preload(){}

function setup(){
    //canvas = createCanvas(windowWidth, windowHeight);
    canvas = createCanvas(640,480);
    canvas.style('display','block');
    video = createCapture(VIDEO);
    video.hide();
    poseNet = ml5.poseNet(video, modelReady); // Load the poseNet model
    poseNet.on('pose', gotPoses);
}

/* Function callback for when a pose is detected 
   prints out an array of all the pose information to the console 
 */
function gotPoses(poses){
    //console.log(poses);
    /* Track nose when atleast one pose is detected */
    if(poses.length > 0 ){
        let nX = poses[0].pose.keypoints[0].position.x;
        let nY = poses[0].pose.keypoints[0].position.y;
        let eX = poses[0].pose.keypoints[1].position.x;
        let eY = poses[0].pose.keypoints[1].position.y;
        noseX = lerp(noseX, nX, 0.5);
        noseY = lerp(noseY, nY, 0.5);
        eyelX = lerp(eyelX, eX, 0.5);
        eyelY = lerp(eyelY, eY, 0.5);        
    }
}

/* Function callback for when ml5 successfully opens */
function modelReady(){
    //console.log(ml5);
    //console.log('model ready');
}

function draw(){
    background(0);
    image(video,0,0);

    let d = dist(noseX, noseY, eyelX, eyelY);

    filter(GRAY);
    fill(255, 0, 0);
    ellipse(noseX, noseY, d);
    fill(0);
    ellipse(eyelX, eyelY, d);
}

function windowResized(){
    //resizeCanvas(windowWidth,windowHeight);
}

