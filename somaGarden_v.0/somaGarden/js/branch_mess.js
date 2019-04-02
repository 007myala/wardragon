/*
     Constructor function for a branch that takes a start and an end as parameters
*/
function Branch(begin, end, theta){
     this.begin = begin;
     this.end = end;
     this.finished = false;
     this.theta = theta;

     this.show = function(){
          stroke(0);
          line(this.begin.x, this.begin.y, this.end.x, this.end.y);
     }

     /*
          Draws a new right branch that starts at the previous branch's end
     */
     this.branchR = function(theta){
          // calculate the new endpoint from a direction vector
          var dir = p5.Vector.sub(this.end, this.begin);
          dir.rotate(theta); //PI/4
          dir.mult(0.67);
          var newEnd = p5.Vector.add(this.end, dir);

          var right = new Branch(this.end, newEnd);
          return right;
     }

     /*
          Draws a new left branch that starts at the previous branch's end
     */
     this.branchL = function(theta){
          // calculate the new endpoint from a direction vector
          var dir = p5.Vector.sub(this.end, this.begin);
          dir.rotate(-theta); //-PI/6
          dir.mult(0.67);
          var newEnd = p5.Vector.add(this.end, dir);

          var left = new Branch(this.end, newEnd);
          return left;
     }

     this.jitter = function(){
          this.end.x += random(-1,1);
          this.end.y += random(-1,1);
     }

}
