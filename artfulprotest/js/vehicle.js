function Vehicle(x,y,h) {
     // this.pos = createVector(x,y);
     this.pos = createVector(random(width), random(height));
     this.target = createVector(x,y);
     //this.vel = createVector();
     this.vel = p5.Vector.random2D();
     this.acc = createVector();
     this.r = 8;
     this.hue = h;
     this.maxspeed = 5;
     this.maxforce = 0.3;
}
Vehicle.prototype.behaviors = function(){
     //var seek = this.seek(this.target);
     //this.applyForce(seek);
     var arrive = this.arrive(this.target);
     this.applyForce(arrive);

     var seek = this.seek(this.target);
     this.applyForce(seek);
}

Vehicle.prototype.applyForce = function(f){
     this.acc.add(f);
}

Vehicle.prototype.update = function() {
     this.pos.add(this.vel);
     this.vel.add(this.acc);
     this.acc.mult(0);
}

Vehicle.prototype.show = function() {
     colorMode(HSL, 360);
     stroke(this.hue,200,200);
     strokeWeight(9);
     point(this.pos.x,this.pos.y);
}

Vehicle.prototype.arrive = function(target) {
     var desired = p5.Vector.sub(target, this.pos);
     var d = desired.mag();
     var speed = this.maxspeed;
     if(d < 100){
          speed = map(d, 0, 100, 0, this.maxspeed);
     }
     desired.setMag(speed);
     var steer = p5.Vector.sub(desired, this.vel);
     steer.limit(this.maxforce);
     return steer;
}

Vehicle.prototype.seek = function(target) {
     var desired = p5.Vector.sub(target, this.pos);
     desired.setMag(this.maxspeed);
     var steer = p5.Vector.sub(desired, this.vel);
     steer.limit(this.maxforce);
     return steer;
}
