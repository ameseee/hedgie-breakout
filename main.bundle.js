/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(1);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	const Block = __webpack_require__(2);
	const Paddle = __webpack_require__(5);
	const Ball = __webpack_require__(6);
	const Powerup = __webpack_require__(3);

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
	      buildAnArray.splice(i, 1);
	    }
	  }
	}

	canvas.addEventListener('mousemove', e => {
	  paddle.cursorHandler(e);
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
	          <p class="lost-life-text">You are running low on chances to save the hedgie - just ${this.livesRemaining} left!</p>
	          <p class="lost-life-text" id="p2">Click the button to continue on to your next chance.</p>
	          <button id="continue-to-next-life">Continue</button>
	      </div>`;
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
	    let gameOverModal = document.getElementById('lost-game-modal');
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
	      paddle.resetPaddle();
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
	        <p class="level-up-text">You are one step closer to saving the hedgie!</p>
	        <p class="level-up-text" id="p2">Click the button to start level ${this.currentLevel}.</p>
	        <button id="continue-to-next-level">Continue</button>
	        </div>`;

	    game.hideCanvasAndInfo();
	    document.body.appendChild(levelUpModal);
	    levelUpModal.innerHTML = levelUpAppend;
	    currentLevelInfoBar.innerHTML = `Current Level: ${this.currentLevel}`;
	  }

	  continueToLevelTwo() {
	    let levelUpBtn = document.getElementById('continue-to-next-level');

	    levelUpBtn.addEventListener('click', function () {
	      buildAnArray = block.buildLevelTwo();
	      levelUpModal.remove();
	      game.showCanvasAndInfo();
	    });
	  }

	  continueToLevelThree() {
	    let levelUpBtn = document.getElementById('continue-to-next-level');

	    levelUpBtn.addEventListener('click', function () {
	      buildAnArray = block.buildLevelThree();
	      levelUpModal.remove();
	      game.showCanvasAndInfo();
	    });
	  }

	  continueToLevelFour() {
	    let levelUpBtn = document.getElementById('continue-to-next-level');

	    levelUpBtn.addEventListener('click', function () {
	      buildAnArray = block.buildLevelFour();
	      levelUpModal.remove();
	      game.showCanvasAndInfo();
	    });
	  }

	  gameWon() {
	    let playAgainBtn = document.getElementById('play-again');

	    document.getElementById('win-sound').volume = 0.5;
	    document.getElementById('win-sound').play();
	    playAgainBtn.addEventListener('click', function () {
	      buildAnArray = block.buildLevelOne();
	      levelUpModal.remove();
	      game.showCanvasAndInfo();
	      game.points = 0;
	      block.updatePointsInfoBar(game);
	      game.livesRemaining = 3;
	      game.livesCounter();
	      game.currentLevel = 1;
	      currentLevelInfoBar.innerHTML = `Current Level: ${game.currentLevel}`;
	    });
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

	function gameLoop() {
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

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	const Powerup = __webpack_require__(3);
	const GamePiece = __webpack_require__(4);

	class Block extends GamePiece {

	  constructor(x, y, special = false, unbreakable = false) {
	    super(x, y);
	    this.width = 50;
	    this.height = 10;
	    this.special = special;
	    this.unbreakable = unbreakable;
	  }

	  draw(context) {
	    if (this.special === true) {
	      context.fillStyle = '#f1544f';
	      context.fillRect(this.x, this.y, this.width, this.height);
	      this.buildTrapezoid(context, this.x, this.y, this.x + 2, this.y + 2, this.x + 2, this.y + 8, this.x, this.y + 10, '#D34A45');
	      this.buildTrapezoid(context, this.x + 48, this.y + 2, this.x + 50, this.y, this.x + 50, this.y + 10, this.x + 48, this.y + 8, '#D34A45');
	      this.buildTrapezoid(context, this.x, this.y, this.x + 50, this.y, this.x + 48, this.y + 2, this.x + 2, this.y + 2, '#973531');
	      this.buildTrapezoid(context, this.x + 2, this.y + 8, this.x + 48, this.y + 8, this.x + 50, this.y + 10, this.x, this.y + 10, '#973531');
	    } else if (this.unbreakable === true) {
	      context.fillStyle = '#efecf0';
	      context.fillRect(this.x, this.y, this.width, this.height);
	      this.buildTrapezoid(context, this.x, this.y, this.x + 2, this.y + 2, this.x + 2, this.y + 8, this.x, this.y + 10, '#dcd9dc');
	      this.buildTrapezoid(context, this.x + 48, this.y + 2, this.x + 50, this.y, this.x + 50, this.y + 10, this.x + 48, this.y + 8, '#dcd9dc');
	      this.buildTrapezoid(context, this.x, this.y, this.x + 50, this.y, this.x + 48, this.y + 2, this.x + 2, this.y + 2, '#a5a3a5');
	      this.buildTrapezoid(context, this.x + 2, this.y + 8, this.x + 48, this.y + 8, this.x + 50, this.y + 10, this.x, this.y + 10, '#a5a3a5');
	    } else {
	      context.fillStyle = '#4fecf1';
	      context.fillRect(this.x, this.y, this.width, this.height);
	      this.buildTrapezoid(context, this.x, this.y, this.x + 2, this.y + 2, this.x + 2, this.y + 8, this.x, this.y + 10, '#45CFD3');
	      this.buildTrapezoid(context, this.x + 48, this.y + 2, this.x + 50, this.y, this.x + 50, this.y + 10, this.x + 48, this.y + 8, '#45CFD3');
	      this.buildTrapezoid(context, this.x, this.y, this.x + 50, this.y, this.x + 48, this.y + 2, this.x + 2, this.y + 2, '#319397');
	      this.buildTrapezoid(context, this.x + 2, this.y + 8, this.x + 48, this.y + 8, this.x + 50, this.y + 10, this.x, this.y + 10, '#319397');
	    }
	  }

	  buildTrapezoid(context, x1, y1, x2, y2, x3, y3, x4, y4, color) {
	    context.beginPath();
	    context.moveTo(x1, y1);
	    context.lineTo(x2, y2);
	    context.lineTo(x3, y3);
	    context.lineTo(x4, y4);
	    context.closePath();
	    context.fillStyle = color;
	    context.fill();
	  }

	  randomSpecialBlocks(arr, numOfSpecialBlocks) {
	    let buffer = [],
	        start;

	    for (let i = arr.length; i >= arr.length && i > 0; i--) {
	      start = Math.floor(Math.random() * arr.length);
	      buffer.push(arr.splice(start, 1)[0]);
	    }

	    this.assignSpecialBlocks(buffer, numOfSpecialBlocks);
	    return buffer;
	  }

	  buildLevelOne() {
	    let levelOneArray = [];

	    for (let i = 0; i < 24; i++) {
	      this.x = 6.25 + i % 8 * 50 * 1.25;
	      this.y = 6 + i % 3 * 10 * 2;
	      levelOneArray.push(new Block(this.x, this.y));
	    }

	    levelOneArray = this.randomSpecialBlocks(levelOneArray, 1);
	    return levelOneArray;
	  }

	  buildLevelTwo() {
	    let levelTwoArray = [];

	    for (let i = 0; i < 12; i++) {
	      if (i === 7) {
	        this.unbreakable = true;
	        this.x = 6.25 + i % 3 * 50 * 1.25;
	        this.y = 6 + i % 4 * 10 * 2;
	        levelTwoArray.push(new Block(this.x, this.y, false, this.unbreakable));
	      } else {
	        this.x = 6.25 + i % 3 * 50 * 1.25;
	        this.y = 6 + i % 4 * 10 * 2;
	        levelTwoArray.push(new Block(this.x, this.y));
	      }
	    }

	    for (let i = 0; i < 12; i++) {
	      if (i === 7) {
	        this.unbreakable = true;
	        this.x = 312.5 + (6.25 + i % 3 * 50 * 1.25);
	        this.y = 6 + i % 4 * 10 * 2;
	        levelTwoArray.push(new Block(this.x, this.y, false, this.unbreakable));
	      } else {
	        this.x = 312.5 + (6.25 + i % 3 * 50 * 1.25);
	        this.y = 6 + i % 4 * 10 * 2;
	        levelTwoArray.push(new Block(this.x, this.y));
	      }
	    }

	    levelTwoArray = this.randomSpecialBlocks(levelTwoArray, 2);
	    return levelTwoArray;
	  }

	  buildLevelThree() {
	    let levelThreeArray = [];

	    for (let i = 0; i < 6; i++) {
	      this.x = 193.75 + i % 2 * 50 * 1.25;
	      this.y = 125 + i % 3 * 10 * 2;
	      levelThreeArray.push(new Block(this.x, this.y));
	    }

	    for (var i = 0; i < 1; i++) {
	      levelThreeArray[i].special = true;
	    }

	    levelThreeArray = this.randomSpecialBlocks(levelThreeArray, 0);
	    return levelThreeArray;
	  }

	  buildLevelFour() {
	    let levelFourArray = [];

	    for (let i = 0; i < 12; i++) {
	      if (i === 11) {
	        this.unbreakable = true;
	        this.x = 6.25 + i % 3 * 50 * 1.25;
	        this.y = 6 + i % 4 * 10 * 2;
	        levelFourArray.push(new Block(this.x, this.y, false, this.unbreakable));
	      } else {
	        this.x = 6.25 + i % 3 * 50 * 1.25;
	        this.y = 6 + i % 4 * 10 * 2;
	        levelFourArray.push(new Block(this.x, this.y));
	      }
	    }

	    for (let i = 0; i < 12; i++) {
	      if (i === 3) {
	        this.unbreakable = true;
	        this.x = 312.5 + (6.25 + i % 3 * 50 * 1.25);
	        this.y = 6 + i % 4 * 10 * 2;
	        levelFourArray.push(new Block(this.x, this.y, false, this.unbreakable));
	      } else {
	        this.x = 312.5 + (6.25 + i % 3 * 50 * 1.25);
	        this.y = 6 + i % 4 * 10 * 2;
	        levelFourArray.push(new Block(this.x, this.y));
	      }
	    }

	    for (let i = 0; i < 12; i++) {
	      if (i === 7) {
	        this.unbreakable = true;
	        this.x = 156.25 + (6.25 + i % 3 * 50 * 1.25);
	        this.y = 88 + (6 + i % 4 * 10 * 2);
	        levelFourArray.push(new Block(this.x, this.y, false, this.unbreakable));
	      } else {
	        this.x = 156.25 + (6.25 + i % 3 * 50 * 1.25);
	        this.y = 88 + (6 + i % 4 * 10 * 2);
	        levelFourArray.push(new Block(this.x, this.y));
	      }
	    }

	    for (let i = 0; i < 12; i++) {
	      this.x = 6.25 + i % 3 * 50 * 1.25;
	      this.y = 172 + (6 + i % 4 * 10 * 2);
	      levelFourArray.push(new Block(this.x, this.y));
	    }

	    for (let i = 0; i < 12; i++) {
	      this.x = 312.5 + (6.25 + i % 3 * 50 * 1.25);
	      this.y = 172 + (6 + i % 4 * 10 * 2);
	      levelFourArray.push(new Block(this.x, this.y));
	    }

	    levelFourArray = this.randomSpecialBlocks(levelFourArray, 2);
	    return levelFourArray;
	  }

	  assignSpecialBlocks(array, number) {
	    for (var i = 0; i < number; i++) {
	      if (array[i].unbreakable === false) {
	        array[i].special = true;
	      }
	    }
	  }

	  buildBlock(array, context) {
	    for (let i = 0; i < array.length; i++) {
	      array[i].draw(context);
	    }
	  }

	  breakBlock(array, ball, game, powerupArray) {
	    for (let i = 0; i < array.length; i++) {
	      if (ball.y + 6 >= array[i].y && ball.y - 6 <= array[i].y + 10 && ball.x <= array[i].x + 50 && ball.x >= array[i].x) {
	        ball.moveY = -ball.moveY;
	        if (array[i].unbreakable === false) {
	          game.points += 10;
	          this.updatePointsInfoBar(game);
	          document.getElementById('normal-bounce-sound').volume = 0.5;
	          document.getElementById('normal-bounce-sound').play();
	        } else {
	          document.getElementById('unbreakable-bounce-sound').volume = 0.5;
	          document.getElementById('unbreakable-bounce-sound').play();
	          return;
	        }

	        if (array[i].special === true) {
	          powerupArray.push(new Powerup(array[i].x + 5, array[i].y));
	          game.points += 15;
	          this.updatePointsInfoBar(game);
	          document.getElementById('special-bounce-sound').volume = 0.8;
	          document.getElementById('special-bounce-sound').play();
	        }

	        array.splice(i, 1);
	      }
	    }
	  }

	  updatePointsInfoBar(game) {
	    let pointsInfoBar = document.getElementById('points');

	    pointsInfoBar.innerHTML = `Points: ${game.points}`;
	  }

	}

	module.exports = Block;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	const GamePiece = __webpack_require__(4);

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
	    context.strokeStyle = '#9bf14f';
	    context.lineJoin = 'round';
	    context.lineWidth = 5;
	    context.strokeRect(this.x + this.radius / 2, this.y + this.radius / 2, this.width - this.radius, this.height - this.radius);
	    context.fillRect(this.x + this.radius / 2, this.y + this.radius / 2, this.width - this.radius, this.height - this.radius);
	    context.font = '10px Ubuntu';
	    context.textAlign = 'center';
	    context.textBaseline = 'middle';
	    context.fillStyle = '#000';
	    context.fillText('P', this.x + 15, this.y + 6);
	  }

	  hitsPaddle(paddle, ball, array, game, block) {
	    for (var i = 0; i < array.length; i++) {
	      if (array[i].y + array[i].height >= paddle.y && array[i].x <= paddle.x + paddle.width && array[i].x + array[i].width >= paddle.x && array[i].y <= paddle.y + 12) {
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

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	class GamePiece {

	  constructor(x, y) {
	    this.x = x;
	    this.y = y;
	  }

	}

	module.exports = GamePiece;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	const GamePiece = __webpack_require__(4);

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

	    this.x = cursorX - this.width / 2;
	    if (cursorX <= this.width / 2) {
	      this.x = 0;
	    } else if (cursorX > canvas.width - this.width / 2) {
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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	const GamePiece = __webpack_require__(4);

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
	    if (this.moveX === 0) {
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
	    let paddleQuintent = paddle.width / 5;
	    let maxSpeed = 4;
	    let ballRadius = 6;

	    if (this.y === paddle.y - ballRadius && this.x + ballRadius >= paddleLeft + paddleQuintent * leftEnd && this.x - ballRadius <= paddleLeft + paddleQuintent * rightEnd) {
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

/***/ })
/******/ ]);