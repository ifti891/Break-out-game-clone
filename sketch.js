function setup() {
  createCanvas(800, 600);
}

function draw() {
  background(220);
}

class Bricks {
  constructor() {
    this.colors = [
      "orange",
      "Teal",
      "Magenta",
      "Blue",
      "Red",
      "Yellow",
      "Green",
      "Purple",
      "Maroon",
    ];
    this.brickSpace = 20;

    this.createBricks();
    this.init();
  }

  init() {
    this.rows = 1;
    this.cols = 5;

    this.createBricks();
  }

  advance() {
    this.rows++;
    this.cols++;

    this.createBricks();
  }

  createBricks() {
    this.brickWidth = (width - (this.cols + 1) * this.brickSpace) / this.cols;
    this.brickHeight = this.brickWidth * 0.4;

    this.bricks = [];

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        let x = this.brickSpace + col * (this.brickSpace + this.brickWidth);
        let y = this.brickSpace + row * (this.brickSpace + this.brickHeight);

        // rect(x, y, this.brickWidth, this.brickHeight);

        this.bricks.push({ x, y });
      }
    }
  }

  display() {
    stroke("black");

    let clr = this.colors[(this.rows - 1) % this.colors.length];
    fill(clr);

    for (let brick of this.bricks) {
      rect(brick.x, brick.y, this.brickWidth, this.brickHeight);
    }
  }

  update() {
    for (let i = this.bricks.length - 1; i >= 0; i--) {
      let brick = this.bricks[i];

      if (brick.hit) {
        brick.y += 20;
        // this.bricks.splice(i, 1);
      }

      if (brick.y > height) {
        this.bricks.splice(i, 1);
      }

      // if(brick.hit)
      //     this.bricks.splice(i, 1);
    }
  }

  // returns true if the ball hits any brick
  hit(ball) {
    for (
      let i = this.bricks.length - 1;
      i >= 0;
      i--
    ) // for(let brick of this.bricks)
    {
      let brick = this.bricks[i];
      //  for(let brick of this.bricks)

      if (brick.hit) continue;

      let collide = collisionCircleRect(
        ball.x,
        ball.y,
        ball.r,
        brick.x,
        brick.y,
        this.brickWidth,
        this.brickHeight
      );

      if (collide) {
        // this.bricks.splice(i, 1);
        brick.hit = true;
        return true;
      }
    }
    return false;
  }
}

class Paddle {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.x = (width - this.w) / 2;
    this.y = height - this.h * 2;

    this.init();
  }

  init() {
    this.x = (width - this.w) / 2;
  }

  display() {
    stroke("black");
    fill("brown");

    rect(this.x, this.y, this.w, this.h);
  }

  update() {
    if (keyIsDown(LEFT_ARROW) && this.x > 0) {
      this.x -= 10;
    } else if (keyIsDown(RIGHT_ARROW) && this.x < width - this.w) {
      this.x += 10;
    }
  }
}

class Ball {
  constructor(paddle, bricks) {
    this.paddle = paddle;
    this.bricks = bricks;

    this.balls = 3;

    this.r = 10;
    this.x = this.x = this.paddle.x + this.paddle.w / 2;
    this.y = this.y = this.paddle.y - this.r;

    this.dx = random(-1, 1);
    this.dy = -1;
    this.speed = 3;

    this.inMotion = false;

    this.init();
  }

  init() {
    this.balls = 3;
    this.inMotion = false;
  }

  display() {
    stroke("black");
    fill("darkgreen");
    circle(this.x, this.y, this.r);
  }

  update() {
    if (this.inMotion) {
      this.updateInMotion();
    } else {
      this.updateOnPaddle();
    }
  }

  updateInMotion() {
    // println("Launched")
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;

    // collision with screen with edges
    if (this.x < 0 || this.x > width) {
      this.dx *= -1;

      sound("switch2");
    }

    if (this.y < 0) {
      this.dy *= -1;

      sound("switch2");
    }
    //Collision with paddle
    if (
      this.y > this.paddle.y - this.speed &&
      this.paddle.x < this.x &&
      this.paddle.x + this.paddle.w > this.x
    ) {
      this.y = this.paddle.y - this.r;
      this.dy *= -1;

      sound("switch3");
    }

    // loose ball
    if (this.y > this.paddle.y + this.speed) {
      this.balls--;
      this.inMotion = false;
    }

    // check collision with bricks
    if (this.bricks.hit(this)) {
      this.dy *= -1;

      sound("switch2");
    }
  }

  updateOnPaddle() {
    if (keyIsDown(32)) {
      this.inMotion = true;
    }
    this.x = this.paddle.x + this.paddle.w / 2;
    this.y = this.paddle.y - this.r;
  }
}

class Game {
  constructor() {
    background("Field");
    // music("8 bit intro", 0.2);
    this.bricks = new Bricks();
    this.paddle = new Paddle(100, 20);
    this.ball = new Ball(this.paddle, this.bricks);
  }

  display() {
    this.ball.display();
    this.paddle.display();
    this.bricks.display();

    this.displayStats();
  }

  displayStats() {
    noStroke();
    fill("black");
    text("Bricks: " + this.bricks.bricks.length, 10, height - 30);
    text("Balls: " + this.ball.balls, 10, height - 10);
  }

  update() {
    this.ball.update();
    this.paddle.update();
    this.bricks.update();

    if (this.ball.balls <= 0) {
      this.bricks.init();
      this.paddle.init();
      this.ball.init();
    }

    if (this.bricks.bricks.length <= 0) {
      this.bricks.advance();
      this.paddle.init();
      this.ball.init();
    }
  }
}

let game = new Game();

function loop() {
  clear();

  game.update();
  game.display();
}
