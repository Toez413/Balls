"use strict";

function Stick(position){
    this.position = position;
    this.origin = new Vector2(970,11);
    this.shotOrigin = new Vector2(950,11);
    this.shooting = false;
    this.visible = true;
    this.rotation = 0;
    this.power = 0;
}

Stick.prototype.handleInput = function (delta) {

    if(Game.policy.turnPlayed)
      return;

    if(Keyboard.down(Keys.Q)){
      if(this.power < 75){
        this.origin.x+=2;
        this.power+=1.2;
      }
    }

    if(Keyboard.down(Keys.A)){
      if(this.power>0){
        this.origin.x-=2;
        this.power-=1.2;
      }
    }
    else if (this.power>0 && Mouse.left.down){
      var strike = sounds.strike.cloneNode(true);
      strike.volume = (this.power/(10))<1?(this.power/(10)):1;
      strike.play();
      Game.policy.turnPlayed = true;
      this.shooting = true;
      this.origin = this.shotOrigin.copy();

      Game.gameWorld.ball.shoot(this.power, this.rotation);
      var stick = this;
      setTimeout(function(){stick.visible = false;}, 500);
    }
    else{
      var opposite = Mouse.position.y - this.position.y;
      var adjacent = Mouse.position.x - this.position.x;
      this.rotation = Math.atan2(opposite, adjacent);
    }
};

Stick.prototype.update = function(){
  if(this.shooting && !Game.gameWorld.ball.moving)
    this.reset();
};

Stick.prototype.reset = function(){
  this.position.x = Game.gameWorld.ball.position.x;
  this.position.y = Game.gameWorld.ball.position.y;
	this.origin = new Vector2(970,11);
  this.shooting = false;
  this.visible = true;
	this.power = 0;
};

Stick.prototype.draw = function () {
  if(!this.visible)
    return;

    if(!this.shooting) {
    var ctx = Canvas2D._canvasContext;
    var canvasScale = Canvas2D.scale;
    ctx.save();
    ctx.scale(canvasScale.x, canvasScale.y);
    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);

    var cueBall = Game.gameWorld.ball;
    var balls = Game.gameWorld.balls;
    var direction = new Vector2(Math.cos(this.rotation), Math.sin(this.rotation));
    var pos = cueBall.position.copy();
    var step = 1; // smaller step for more precision
    var collision = null;
    var collisionType = null; // "ball" or "border"
    var maxDistance = 2000;

    var left = Game.policy.leftBorderX;
    var right = Game.policy.rightBorderX;
    var top = Game.policy.topBorderY;
    var bottom = Game.policy.bottomBorderY;

    for (var d = 0; d < maxDistance; d += step) {
      pos.x += direction.x * step;
      pos.y += direction.y * step;

      // Check border collision
      if (pos.x <= left || pos.x >= right || pos.y <= top || pos.y >= bottom) {
        collision = pos.copy();
        collisionType = "border";
        break;
      }

      // Check ball collision (skip cue ball itself)
      for (var i = 0; i < balls.length; i++) {
        var ball = balls[i];
        if (ball === cueBall) continue;
        var dist = pos.distanceFrom(ball.position);
        if (dist <= cueBall.origin.x + ball.origin.x) { // use origin.x as radius (25)
          collision = pos.copy();
          collisionType = "ball";
          break;
        }
      }
      if (collision) break;
    }
// ...existing code...
if (collision) {
// Draw main cue ball trajectory
ctx.lineTo(collision.x, collision.y);
ctx.stroke();
ctx.setLineDash([]);

// Draw the virtual cue ball circle exactly at the collision point (tangent to the hit ball)
ctx.beginPath();
ctx.arc(collision.x, collision.y, cueBall.origin.x*1, 0, 2 * Math.PI);
ctx.strokeStyle = "#FFA500"; // orange
ctx.lineWidth = 2;
ctx.stroke();

// --- Draw target ball trajectory after impact ---
if (collisionType === "ball") {
  // Find which ball was hit
  var hitBall = null;
  for (var i = 0; i < balls.length; i++) {
    var ball = balls[i];
    if (ball === cueBall) continue;
    var dist = collision.distanceFrom(ball.position);
    if (Math.abs(dist - (cueBall.origin.x + ball.origin.x)) < 1) {
      hitBall = ball;
      break;
    }
  }
  if (hitBall) {
    // Target ball direction: from collision point to hit ball center (normal at contact)
    var targetDir = new Vector2(
      hitBall.position.x - collision.x,
      hitBall.position.y - collision.y
    );
    var len = Math.sqrt(targetDir.x * targetDir.x + targetDir.y * targetDir.y);
    targetDir.x /= len;
    targetDir.y /= len;

    // Draw a longer dashed line from the collision point in the target ball's direction
    var targetLen = 180; // make it longer
    ctx.beginPath();
    ctx.moveTo(collision.x, collision.y);
    ctx.lineTo(
      collision.x + targetDir.x * targetLen,
      collision.y + targetDir.y * targetLen
    );
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
  }
}
} else {
  // No collision found, draw full length
  var endX = this.position.x + direction.x * 300;
  var endY = this.position.y + direction.y * 300;
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.setLineDash([]);
}
// ...existing code...
    ctx.restore();
  }
  Canvas2D.drawImage(sprites.stick, this.position,this.rotation,1, this.origin);
};