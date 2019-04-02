function Branch(begin, end, thickness, depth){
     this.begin = begin;
     this.end = end;
     this.finished = false;
     this.thickness = thickness;
     this.depth = depth;

     this.show = function(){
          var level = Math.round(this.depth);
          if(level == 1){
              //stroke(0);
              var t = 1;
              var rBttm = this.begin;
              var rTp = this.end;
              //strokeWeight(t);
              //fill(0);
              //beginShape();
              //vertex(rBttm.x - 20, rBttm.y);
              //vertex(rTp.x - 20, rTp.y);
              //vertex(rTp.x + 20, rTp.y);
              //vertex(rBttm.x + 20, rBttm.y);
              //endShape();
              
          } else if(level == 2){
              stroke(0);
              var t = this.thickness;
            strokeWeight(t);
            line(this.begin.x, this.begin.y, this.end.x, this.end.y);
          } else if(level == 3){
              stroke(0);
              var t = this.thickness;
            strokeWeight(t);
            line(this.begin.x, this.begin.y, this.end.x, this.end.y);
          } else {
              stroke(0);
              var t = this.thickness;
            strokeWeight(t);
            line(this.begin.x, this.begin.y, this.end.x, this.end.y);
          }
          
     }

     /*
          Draws a new right branch that starts at the previous branch's end
     */
     this.branchR = function(bThick, bAngle){
          var level = Math.round(this.depth);
          // calculate the new endpoint from a direction vector
          var dir = p5.Vector.sub(this.end, this.begin);
          if(level == 1){
              dir.rotate(PI/6);
          } else {
              dir.rotate(bAngle);
          }          
          dir.mult(0.67);
          var newEnd = p5.Vector.add(this.end, dir);

          var right = new Branch(this.end, newEnd, bThick, this.depth + 1);
          return right;
     }

     /*
          Draws a new left branch that starts at the previous branch's end
     */
     this.branchL = function(bThick, bAngle){
          var level = Math.round(this.depth);
          // calculate the new endpoint from a direction vector
          var dir = p5.Vector.sub(this.end, this.begin);
          if(level == 1){
              dir.rotate(-PI/6);
          } else {
              dir.rotate(-bAngle);
          } 
          dir.mult(0.67);
          var newEnd = p5.Vector.add(this.end, dir);

          var left = new Branch(this.end, newEnd, bThick, this.depth + 1);
          return left;
     }

     this.jitter = function(){
          this.end.x += random(-1,1);
          this.end.y += random(-1,1);
     }
}
