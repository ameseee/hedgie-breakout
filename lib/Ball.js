const GamePiece = require('./GamePiece');

class Ball extends GamePiece {

  constructor(x, y) {
    super(x, y);
    this.width = 6;
    this.height = 6;
    this.moveX = 0;
    this.moveY = -0;
  }

  draw(context, paddle) {
    context.beginPath();
    context.arc(this.x, this.y, 6, 0, Math.PI * 2);
    context.fillStyle = '#fff';
    context.fill();
    context.closePath();
    if (this.moveX === 0) {
      this.x = paddle.x + 35;
      this.y = paddle.y - 6;
    } else {
      this.x += this.moveX;
      this.y += this.moveY;
    }
  }

  initiateVelocity() {
    if  (this.moveX === 0) {
      this.moveX = this.moveX + 2;
      this.moveY = this.moveY - 2;
    }
  }

  resetBall() {
    this.moveX = 0;
    this.moveY = 0;
  }

  bounceWalls(canvasWidth) {
    let bounceWallSound = document.getElementById('wall-bounce');

    bounceWallSound.volume = 0.05;

    if (this.x + 6 >= canvasWidth) {
      this.moveX = -this.moveX;
      bounceWallSound.play();
    } else if (this.x - 6 <= 0) {
      this.moveX = -this.moveX;
      bounceWallSound.play();
    } else if (this.y - 6 <= 0) {
      this.moveY = -this.moveY;
      bounceWallSound.play();
    }
  }

  bouncePaddleY(paddle) {
    let paddleRight = paddle.x + paddle.width;
    let paddleLeft = paddle.x;
    let unbreakableBounceSound = document.getElementById('unbreakable-bounce-sound');

    if (this.y >= paddle.y - 6 && this.x + 6 >= paddleLeft && this.x - 6 <= paddleRight) {
      if (this.moveY > 4 || this.moveY < -4) {
        this.moveY = -this.moveY;
        if (this.moveY !== 0) {
          unbreakableBounceSound.volume = 0.5;
          unbreakableBounceSound.play();
        }
      } else {
        this.moveY = -this.moveY * 1.1;
        if (this.moveY !== 0) {
          unbreakableBounceSound.volume = 0.5;
          unbreakableBounceSound.play();
        }
      }
    }
  }

  bounceModulator(leftEnd, rightEnd, negativeXModulator, positiveXModulator, paddle) {
    let paddleLeft = paddle.x;
    let paddleQuintent = (paddle.width / 5)
    let maxSpeed = 4;
    let ballRadius = 6;

    if (this.y === paddle.y - ballRadius
        && this.x + ballRadius >= paddleLeft + (paddleQuintent * leftEnd)
        && this.x - ballRadius <= paddleLeft + (paddleQuintent * rightEnd)) {
      if (this.moveX < maxSpeed || this.moveX > -maxSpeed) {
        if (this.moveX < 0) {
          this.moveX *= negativeXModulator;
        } else {
          this.moveX *= positiveXModulator;
        }
      }
    }
  }

  bouncePaddleX(paddle) {
    this.bounceModulator(3, 4, 0.9, 1.3, paddle);
    this.bounceModulator(4, 5, 0.7, 1.3, paddle);
    this.bounceModulator(1, 2, 0.9, 1.1, paddle);
    this.bounceModulator(2, 3, 0.7, 1.3, paddle);
  }

  slowBall() {
    this.moveX /= 2;
    this.moveY /= 2;
  }

  // fastBall() {
  //   this.moveX *= 2;
  //   this.moveY *= 2;
  // }

}

module.exports = Ball;
