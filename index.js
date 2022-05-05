const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 700;

canvas.style.border = '3px solid black';

class Position {
  x = 0;
  y = 0;
}

let lastUpdate = Date.now();
let dt = 0;
const mousePosBegin = new Position();
const mousePosEnd = new Position();

function distanceHyp() {
  return Math.sqrt(Math.pow(mousePosEnd.x - mousePosBegin.x, 2) + Math.pow(mousePosEnd.y - mousePosBegin.y, 2));
}

class Ball {
  constructor(canvas, radius) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.radius = radius;
    this.angle = 1;
  }

  update(deltaTime) {
    this.x += this.speed * Math.cos(this.angle) * deltaTime * 0.001;
    this.y += this.speed * Math.sin(this.angle) * deltaTime * 0.001;
  }

  applyFriction(deltaTime, friction) {
    this.speed -= this.speed * friction * deltaTime * 0.001;

    if (this.speed < 10) {
      this.speed = 0;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    ctx.fillStyle = 'red';
    ctx.fill();
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  setAngle(angle) {
    this.angle = angle;
    console.log((angle * 180) / Math.PI + '°');
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ball = new Ball(canvas, 10);
    this.ball.speed = 0;
  }

  update() {
    this.ball.update(dt);
    this.ball.applyFriction(dt, 0.8);
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ball.draw();
  }

  eventHandler() {
    document.addEventListener('mousedown', e => {
      mousePosBegin.x = e.clientX;
      mousePosBegin.y = e.clientY;
    });

    document.addEventListener('mouseup', e => {
      mousePosEnd.x = e.clientX;
      mousePosEnd.y = e.clientY;

      this.ball.setSpeed(distanceHyp());
      this.ball.setAngle(Math.atan2(mousePosEnd.y - mousePosBegin.y, mousePosEnd.x - mousePosBegin.x));
    });
  }
}

let game = new Game(canvas);

function init() {
  requestAnimationFrame(init);
  game.update();
  game.draw();
  game.eventHandler();

  let now = Date.now();
  dt = now - lastUpdate;
  lastUpdate = now;
  /* console.log(dt * 0.001); */
}

init();

document.body.append(canvas);
