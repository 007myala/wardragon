function Country(code,lat,long,name) {
     this.code = code;
     this.latitude = lat;
     this.longitude = long;
     this.name = name;
     this.x;
     this.y;

     this.display = function(){
          fill(0);
          noStroke();
          // Draw a dot
          textSize(20);
          text("(" + this.latitude + "°, " + this.longitude + "°)", 5, height/4);
          text("translated to", 5, height/3);
          text(this.name + " (" + this.x + ", " + this.y + ")", 5, height/2);
     }

     this.translate = function(mW,mH){
          // get the x coordinate
          var mX = (this.longitude+180)*(mW/360);

          // convert from degrees to radians
          var latRad = this.latitude*PI/180;

          // get y value
          var xForLog = tan((PI/4) + (latRad/2));
          var mercN = log(xForLog)/log(10);
          var mY = (mH/2) - (mW*mercN/(2*PI));

          this.x = mX;
          this.y = mY;
     }
}
