const GamePiece = require('./GamePiece');

class Powerup extends GamePiece {

  constructor(x, y) {
    super(x, y);
    this.moveY = 1.3;
    this.width = 30;
    this.height = 12;
    this.radius = 8;
    this.currentPowerup = '';
    this.currentPowerupAlpha = 1;
  }

  draw(context) {
    this.y += this.moveY;
    context.fillStyle = '#9bf14f';
    context.strokeStyle = '#9bf14f'
    context.lineJoin = 'round';
    context.lineWidth = 5;
    context.strokeRect(this.x + (this.radius / 2), this.y + (this.radius / 2), this.width - this.radius, this.height - this.radius);
    context.fillRect(this.x + (this.radius / 2), this.y + (this.radius / 2), this.width - this.radius, this.height - this.radius);
    context.font = '10px Ubuntu';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000';
    context.fillText('P', this.x + 15, this.y + 6);
  }

  hitsPaddle(paddle, ball, array, game, block) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].y + array[i].height >= paddle.y
          && array[i].x <= paddle.x + paddle.width
          && array[i].x + array[i].width >= paddle.x
          && array[i].y <= paddle.y + 12 ) {
        array[i].y = -20;
        array[i].moveY = 0;
        game.points += 25;
        block.updatePointsInfoBar(game);
        this.chooseRandomPowerup(ball, paddle);
        document.getElementById('powerup-paddle').volume = 0.1;
        document.getElementById('powerup-paddle').play();
      }
    }
  }

  dropPowerup(array, context) {
    for (var i = 0; i < array.length; i++) {
      array[i].draw(context);
    }
  }

  chooseRandomPowerup(ball, paddle) {
    let rollDice = Math.random();

    if (rollDice <= 0.5) {
      this.currentPowerupAlpha = 1;
      this.currentPowerup = 'Long Paddle';
      return paddle.resetPaddle();
    } else if (rollDice > 0.5 && rollDice <= 1) {
      this.currentPowerupAlpha = 1;
      this.currentPowerup = 'Slow Ball';
      return ball.slowBall();
    }
  }


  drawPowerupText(context) {
    let decrementer = .01;

    context.font = '20px Ubuntu';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    this.currentPowerupAlpha -= decrementer;
    context.fillStyle = `rgba(155, 241, 79, ${this.currentPowerupAlpha})`;
    context.fillText(this.currentPowerup, 250, 375);
  }

}

module.exports = Powerup;
