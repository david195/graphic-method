/*Contructor*/

function plot(id_content){
  if(arguments.length == 1)
    this.scale = 10;
  else
    this.scale = arguments[1];
  this.canvas = document.getElementById(id_content);
  this.ctx = this.canvas.getContext("2d");
  this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
  this.ctx.strokeStyle = "rgba(0,0,0,0.6)";
  this.ctx.lineWidth = 0.25;
  for(var x=0; x<=this.canvas.width; x+=this.scale){
    this.ctx.beginPath();
    this.ctx.moveTo(x,0);
    this.ctx.lineTo(x,this.canvas.height);
    this.ctx.stroke();
  }
  for(var y=0; y<=this.canvas.height; y+=this.scale){
    this.ctx.beginPath();
    this.ctx.moveTo(0,y);
    this.ctx.lineTo(this.canvas.width,y);
    this.ctx.stroke();
  }
  this.ctx.lineWidth = 0.8;
  this.ctx.beginPath();
  this.ctx.moveTo(this.canvas.width/2,0);
  this.ctx.lineTo(this.canvas.width/2,this.canvas.height);
  this.ctx.stroke();
  this.ctx.beginPath();
  this.ctx.moveTo(0,this.canvas.height/2);
  this.ctx.lineTo(this.canvas.width,this.canvas.height/2);
  this.ctx.stroke();
  this.restrictions = [];
  this.intersections = [];
  this.solution = null;
  this.int_solution = null;
}

/*prototypes*/

plot.prototype.line = function(p1,p2,color){
  p1.x = p1.x*this.scale;  p1.y = p1.y*this.scale;  p2.x = p2.x*this.scale;  p2.y = p2.y*this.scale;
  p1.y = this.canvas.height - p1.y;
  p1.x += this.canvas.width/2;
  p1.y -= this.canvas.height/2;
  p2.y = this.canvas.height - p2.y;
  p2.x += this.canvas.width/2;
  p2.y -= this.canvas.height/2;
  this.ctx.strokeStyle = color;
  this.ctx.lineWidth = 1;
  this.ctx.beginPath();
  this.ctx.moveTo(p1.x,p1.y);
  this.ctx.lineTo(p2.x,p2.y);
  this.ctx.stroke();
}

plot.prototype.region = function(signo,p1,p2,color){
  p1.x = p1.x*this.scale;  p1.y = p1.y*this.scale;  p2.x = p2.x*this.scale;  p2.y = p2.y*this.scale;
  p1.y = this.canvas.height - p1.y;
  p1.x += this.canvas.width/2;
  p1.y -= this.canvas.height/2;
  p2.y = this.canvas.height - p2.y;
  p2.x += this.canvas.width/2;
  p2.y -= this.canvas.height/2;
  this.ctx.fillStyle = color;
  this.ctx.lineWidth = 1;
  this.ctx.beginPath();
  if(signo == "<"){
    this.ctx.moveTo(this.canvas.width/2, this.canvas.height/2);
    this.ctx.lineTo(p1.x,p1.y);
    this.ctx.lineTo(p2.x,p2.y);
    this.ctx.lineTo(this.canvas.width/2, this.canvas.height/2);
  }
  else {
    this.ctx.moveTo(p1.x,p1.y);
    this.ctx.lineTo(p1.x,0);
    this.ctx.lineTo(p2.x,0);
    this.ctx.lineTo(p2.x,p2.y);
    this.ctx.lineTo(p1.x,p1.y);
  }
  this.ctx.closePath();
  this.ctx.fill();
}

plot.prototype.restriction = function(nx,ny,signo,res){
  var r = {x:nx,y:ny,signo:signo,res:res};
  this.restrictions.push(r);
  var vy = res/ny;
  var vx = res/nx;
  if(signo == "=")
    this.line({x:0,y:vy},{x:vx,y:0},Rcolor());
  else
    if(signo == "<" || signo == ">")
      this.region(signo,{x:0,y:vy},{x:vx,y:0},Rcolor(0.5));
    else
      return 1;
  return 0;
}

plot.prototype.z = function(x,y,obj){
  this.obj = obj;
  var inter_point = {x:null,y:null};
  var z = null;
  var inter_points = [];
  for(var c1=0; c1<this.restrictions.length; c1++){
    for(var c2=c1+1; c2<this.restrictions.length; c2++){
      inter_points.push(intersect(this.restrictions[c1],this.restrictions[c2]));
    }
  }
  for(var i=0; i<inter_points.length; i++){
    if(z==null){
      inter_point = inter_points[i];
      z = x * inter_point.x + y * inter_point.y;
    }
    else {
      inter_point = inter_points[i];
      if(obj="max")
        if((x * inter_points[i].x + y * inter_points[i].y) > z){
          z = x * inter_point.x + y * inter_point.y;
        }
      else
        if((x * inter_points[i].x + y * inter_points[i].y) > z){
          z = x * inter_point.x + y * inter_point.y;
        }
    }
  }
  this.intersections = inter_points;
  this.restriction(x,y,"=",z);
  this.solution = {intersection:inter_point,z:z};
  return this.solution;
}

plot.prototype.int_solve = function(){

  if(this.solution.intersection.x % 1==0 && his.solution.intersection.y % 1 == 0){
    this.int_solution=this.solution;
    return this.int_solution;
  }
  var dx = Math.abs(this.solution.intersection.x % 1 - 0.5);
  var dy = Math.abs(this.solution.intersection.y % 1 - 0.5);

}

/*Auxiliar functions*/

/*Random Color*/
function Rcolor(a){
  var r = Math.round(Math.random()*255);
  var g = Math.round(Math.random()*255);
  var b = Math.round(Math.random()*255);
  if (a==null)
    a=1;
  return this.rgba = "rgba("+r+","+g+","+b+","+a+")";
}

function intersect(line1, line2){
  a=line1.x; b=line1.y; c=line1.res;
  d=line2.x; e=line2.y; f=line2.res;
  g=a*e-b*d;
  x=(c*e-b*f)/g;y=(a*f-c*d)/g;
  return{x:x,y:y};
}
