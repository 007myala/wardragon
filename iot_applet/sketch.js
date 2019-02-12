/*
 * Ubiquitous Computing - Digital Futures, OCAD University
 * Kate Hartman / Nick Puckett
 *
 * Allows you to send data to Adafruit IO + IFTTT
 *
 */


var AIO_KEY = "67617f1858d34435a25919bd0faad0b1";//get this from your account
var channelGroup = "default";
var channel1 = "coolwords";

var emailButton;
var word = ""; //
var desc = ""; // description
var pos = ""; // part of speech
var fdate = ""; // date fetched
var wotdReceived = false;

function setup(){
	createCanvas(windowWidth,windowHeight);

	// Button to trigger an email
	emailButton = createButton('Get Word of the Day');
	emailButton.position(3*windowWidth/4,3*windowHeight/4 + 50);
	emailButton.mousePressed(recieveData);
}

function draw(){
	textAlign(CENTER);
	fill(0);
	if(wotdReceived){
		background(255,255,255);
		textSize(30);
		text("Word of the day for " + fdate + " is: ", windowWidth/4, windowHeight/4, 700, 500);
		textSize(50);
		text(word, windowWidth/4, windowHeight/4 + 60, 700, 500);
		textSize(24);
		text(desc, windowWidth/8, windowHeight/4 + 150, 1000, 500);
	} else {
		background(255,255,255);
		textSize(40);
		text("No word of the day fetched", windowWidth/2, windowHeight/2);
	}
}

/* This function parses JSON data and saves the sender and subject of the last email received */
function reqListener(){
	var response = this.responseText;
	if(this.readyState == this.DONE){
		if(this.status == 200 || this.status == 304){
			wotdReceived = true;
			var sample = "living fossil * Any species discovered first as a fossil and believed extinct, but which is later found living; an organism that has remained unchanged over geological periods. Any living species which very closely resembles fossil relatives in most anatomical details. English biologist, geologist, and naturalist Charles Darwin, who coined the term and who is best known for his contributions towards the science of evolution, was born on this day 210 years ago in 1809.* n * February 12, 2019";
			var feeds = JSON.parse(response);
			var lvalue = feeds.last_value;
			//var vals = lvalue.split('" * "');
			var vals = sample.split("*");
			word = vals[0].trim();
			desc = vals[1].trim();
			pos = vals[2].trim();
			fdate = vals[3].trim();

		     console.log(word);
			console.log(desc);
			console.log(pos);
			console.log(fdate);
		} else {
			wotdReceived = false;
		}
	}
}

/*Use this function when querying all the feeds */
function recListener(){
	var response = this.responseText;
	if(this.readyState == this.DONE){
		if(this.status == 200 || this.status == 304){
			wotdReceived = true;
			var feeds = JSON.parse(response);
			console.log(feeds.length + " Feeds Available");

			feeds.forEach(function (feed) {
		       console.log(feed.name, feed.description);
		  	});
		} else {
			wotdReceived = false;
		}
	}
}

function recieveData(){
	var url = ("https://io.adafruit.com/api/feeds/wotd" + "?x-aio-key=" + AIO_KEY);
	var cReq = new XMLHttpRequest()
	cReq.addEventListener("load", reqListener)
	cReq.open("GET", url)
	cReq.send()
}
