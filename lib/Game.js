const Block = require('./Block.js');
const Paddle = require('./Paddle.js');
const Ball = require('./Ball.js');
const Powerup = require('./Powerup.js');

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const newLifeButton = document.createElement('section');
const infoBar = document.getElementById('info-bar');
const livesLeftInfoBar = document.getElementById('lives-left');
const currentLevelInfoBar = document.getElementById('current-level');
const levelUpModal = document.createElement('article');
const startButton = document.getElementById('start-btn');

const block = new Block();
const paddle = new Paddle(225, 476);
const ball = new Ball(paddle.x + 35, paddle.y - 6);
const powerup = new Powerup();

let buildAnArray = block.buildLevelOne();
let powerupArray = [];

document.addEventListener('keydown', keyHandler);

function keyHandler(e) {
  if (e.keyCode === 39) {
    paddle.moveRight();
  } else if (e.keyCode === 37) {
    paddle.moveLeft();
  } else if (e.keyCode === 65) {
    cheatCode();
  }
}

function cheatCode() {
  for (let i = 0; i < buildAnArray.length; i++) {
    if (buildAnArray[i].unbreakable === false) {
      buildAnArray.splice(i, 1)
    }
  }
}

canvas.addEventListener('mousemove', (e) => {
  paddle.cursorHandler(e)
});

canvas.addEventListener('click', () => {
  ball.initiateVelocity();
});

startButton.addEventListener('click', () => {
  let directionsModal = document.getElementById('directions-modal');

  game.startGame(gameLoop);
  directionsModal.remove();
  game.showCanvasAndInfo();
});

class Game {

  constructor() {
    this.livesRemaining = 3;
    this.currentLevel = 1;
    this.points = 0;
  }

  startGame(gameLoop) {
    requestAnimationFrame(gameLoop);
  }

  hideCanvasAndInfo() {
    canvas.style.display = 'none';
    infoBar.style.display = 'none';
  }

  showCanvasAndInfo() {
    canvas.style.display = 'inline-block';
    infoBar.style.display = 'flex';
  }

  missPaddle(ball, canvas) {
    if (ball.y - 12 >= canvas.height) {
      document.getElementById('die-sound').volume = .5;
      document.getElementById('die-sound').play();
      this.loseOneLife(ball);
      if (this.livesRemaining > 0) {
        this.useNextLife(ball);
      } else if (this.livesRemaining === 0) {
        this.lostGame();
      }
    }
  }

  loseOneLife(ball) {
    ball.resetBall();
    this.livesRemaining--;
    this.livesCounter();
    this.hideCanvasAndInfo();
    document.body.appendChild(newLifeButton);
    game.points -= 50;
    block.updatePointsInfoBar(game);
  }

  useNextLife(ball) {
    newLifeButton.innerHTML = `
      <div id="lost-life-modal" class="animate2 fadeIn">
          <h2 class="lost-life">OOPS!</h2>
          <p class="lost-life-text">You are running low on chances to save the hedgie - just ${this.livesRemaining} left!
          Click the button to continue on to your next chance.</p>
          <button id="continue-to-next-life">Continue</button>
      </div>`
    ;
    this.nextLife(ball);
  }

  lostGame() {
    newLifeButton.innerHTML = `
    <div id="lost-game-modal" class="animate2 fadeIn">
        <h2 class="lost-life">GAME OVER</h2>
        <p class="game-over-text">You will have to let the next person try to save the hedgie. But you did score ${this.points} points!</p>
        <button id="play-again">Play Again</button>
    </div>`;
    currentLevelInfoBar.innerHTML = `Current Level: 1`;
    let gameOverModal = document.getElementById('lost-game-modal')
    let playAgainBtn = document.getElementById('play-again');

    playAgainBtn.addEventListener('click', () => {
      buildAnArray = block.buildLevelOne();
      gameOverModal.remove();
      game.showCanvasAndInfo();
      game.points = 0;
      block.updatePointsInfoBar(game);
      game.livesRemaining = 3;
      game.livesCounter();
      game.currentLevel = 1;
      currentLevelInfoBar.innerHTML = `Current Level: ${game.currentLevel}`;
      ball.resetBall();
    });
  }

  nextLife(ball) {
    let continueToNewLife = document.getElementById('continue-to-next-life');

    continueToNewLife.addEventListener('click', () => {
      ball.resetBall();
      newLifeButton.remove();
      game.showCanvasAndInfo();
      paddle.resetPaddle()
    });
  }

  livesCounter() {
    livesLeftInfoBar.innerHTML = `Lives Left: ${this.livesRemaining}`;
  }

  levelUpAlert() {
    if (this.currentLevel === 1 && buildAnArray.length === 0) {
      this.levelUp();
      this.continueToLevelTwo();
    } else if (this.currentLevel === 2 && buildAnArray.length === 2) {
      this.levelUp();
      this.continueToLevelThree();
    } else if (this.currentLevel === 3 && buildAnArray.length === 0) {
      this.levelUp();
      this.continueToLevelFour();
    } else if (this.currentLevel === 4 && buildAnArray.length === 7) {
      this.currentLevel = 1;
      this.gameWonDom(ball);
      this.gameWon();
    }
  }

  levelUp() {
    this.currentLevel++;
    this.levelUpDom();
    ball.resetBall();
    paddle.resetPaddle();
    document.getElementById('level-up').volume = .5;
    document.getElementById('level-up').play();
  }

  levelUpDom() {
    let levelUpAppend = `<div id="level-up-modal" class="animate2 fadeIn">
        <h2 class="level-up">YOU'RE A HERO!</h2>
        <p class="level-up-text">You are one step closer to saving the hedgie! Click the button to start level ${this.currentLevel}.</p>
        <button id="continue-to-next-level">Continue</button>
        </div>`;

    game.hideCanvasAndInfo();
    document.body.appendChild(levelUpModal);
    levelUpModal.innerHTML = levelUpAppend;
    currentLevelInfoBar.innerHTML = `Current Level: ${this.currentLevel}`;
  }

  continueToLevelTwo() {
    let levelUpBtn = document.getElementById('continue-to-next-level');

    levelUpBtn.addEventListener('click', function() {
      buildAnArray = block.buildLevelTwo();
      levelUpModal.remove();
      game.showCanvasAndInfo();
    })
  }

  continueToLevelThree() {
    let levelUpBtn = document.getElementById('continue-to-next-level');

    levelUpBtn.addEventListener('click', function() {
      buildAnArray = block.buildLevelThree();
      levelUpModal.remove();
      game.showCanvasAndInfo();
    })
  }

  continueToLevelFour() {
    let levelUpBtn = document.getElementById('continue-to-next-level');

    levelUpBtn.addEventListener('click', function() {
      buildAnArray = block.buildLevelFour();
      levelUpModal.remove();
      game.showCanvasAndInfo();
    })
  }

  gameWon() {
    let playAgainBtn = document.getElementById('play-again');

    document.getElementById('win-sound').volume = 0.5;
    document.getElementById('win-sound').play();
    playAgainBtn.addEventListener('click', function() {
      buildAnArray = block.buildLevelOne();
      levelUpModal.remove();
      game.showCanvasAndInfo();
      game.points = 0;
      block.updatePointsInfoBar(game);
      game.livesRemaining = 3;
      game.livesCounter();
      game.currentLevel = 1;
      currentLevelInfoBar.innerHTML = `Current Level: ${game.currentLevel}`;
    })
  }

  gameWonDom(ball) {
    let wonGameAppend = `
      <div id="you-won-modal" class="animate2 fadeIn">
          <h2 class="level-up">YOU DID IT!!!</h2>
          <p class="you-won-text">The hedgie has safely returned home. You earned ${this.points} points!</p>
          <button id="play-again">Play Again</button>
      </div>`;

    game.hideCanvasAndInfo();
    document.body.appendChild(levelUpModal);
    levelUpModal.innerHTML = wonGameAppend;
    ball.resetBall();
  }

}

const game = new Game();

function gameLoop () {
  context.clearRect(0, 0, canvas.width, canvas.height);
  paddle.draw(context);
  ball.draw(context, paddle);
  ball.bounceWalls(canvas.width);
  ball.bouncePaddleY(paddle);
  ball.bouncePaddleX(paddle);
  block.buildBlock(buildAnArray, context);
  block.breakBlock(buildAnArray, ball, game, powerupArray);
  powerup.hitsPaddle(paddle, ball, powerupArray, game, block, context);
  powerup.dropPowerup(powerupArray, context);
  powerup.drawPowerupText(context);
  game.missPaddle(ball, canvas);
  game.levelUpAlert();
  requestAnimationFrame(gameLoop);
}

game.livesCounter();

module.exports = Game;
