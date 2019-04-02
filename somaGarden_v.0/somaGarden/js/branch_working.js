function Branch(begin, end, thickness){
     this.begin = begin;
     this.end = end;
     this.finished = false;
     this.thickness = thickness;

     this.show = function(){
          stroke(255);
          var t = this.thickness;
          strokeWeight(t);
          line(this.begin.x, this.begin.y, this.end.x, this.end.y);
     }

     /*
          Draws a new right branch that starts at the previous branch's end
     */
     this.branchR = function(bThick, bAngle){
          // calculate the new endpoint from a direction vector
          var dir = p5.Vector.sub(this.end, this.begin);
          dir.rotate(bAngle);
          dir.mult(0.67);
          var newEnd = p5.Vector.add(this.end, dir);

          var right = new Branch(this.end, newEnd, bThick);
          return right;
     }

     /*
          Draws a new left branch that starts at the previous branch's end
     */
     this.branchL = function(bThick, bAngle){
          // calculate the new endpoint from a direction vector
          var dir = p5.Vector.sub(this.end, this.begin);
          dir.rotate(-bAngle);
          dir.mult(0.67);
          var newEnd = p5.Vector.add(this.end, dir);

          var left = new Branch(this.end, newEnd, bThick);
          return left;
     }

     this.jitter = function(){
          this.end.x += random(-1,1);
          this.end.y += random(-1,1);
     }
}
