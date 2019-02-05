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
          ellipse(this.x,this.y,10,10);
          // print(this.name + " (" + this.x + ", " + this.y + ")");

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

          // map the x values
          this.x = map(mX,-445,445,0,1150);
          // map the y values
          this.y = map(mY, 186,428,0,700);
     }

     this.clickCheck = function(mX,mY){
          var d = dist(this.x,this.y,mX,mY);
          var maxRadius = 10;
          if(d < (maxRadius-1)){
               // Country has been clicked
               print("Country is clicked");
               // Show the Country
               fill(100,0,0);
               text(12);
               text(this.name,mX,mY);
          } else {
               //print("Country not clicked");
          }
     }
}
