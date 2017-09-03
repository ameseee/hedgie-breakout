const GamePiece = require('./GamePiece');

class Paddle extends GamePiece {

  constructor(x, y) {
    super(x, y);
    this.width = 50;
    this.height = 12;
  }

  draw(context) {
    context.fillStyle = '#a54ff1';
    context.fillRect(this.x, this.y, this.width, this.height);
  }

  moveRight() {
    if (this.x + this.width < 499) {
      this.x += 10;
    }
  }

  moveLeft() {
    if (this.x > 1) {
      this.x -= 10;
    }
  }

  cursorHandler(e) {
    let cursorX = e.clientX - canvas.offsetLeft;

    this.x = cursorX - (this.width / 2);
    if (cursorX <= (this.width / 2)) {
      this.x = 0;
    } else if (cursorX > canvas.width - (this.width / 2)) {
      this.x = canvas.width - this.width;
    }
  }

  longPaddle() {
    this.width *= 1.75;
  }

  shortPaddle() {
    this.width *= 0.4;
  }

  resetPaddle() {
    this.width = 50;
  }

}

module.exports = Paddle;
