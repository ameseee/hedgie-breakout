const Powerup = require('./Powerup.js');
const GamePiece = require('./GamePiece.js');

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
    let buffer = [], start;

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
      this.x = 6.25 + ((i % 8) * 50) * 1.25;
      this.y = 6 + ((i % 3) * 10) * 2;
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
        this.x = 6.25 + ((i % 3) * 50) * 1.25;
        this.y = 6 + ((i % 4) * 10) * 2;
        levelTwoArray.push(new Block(this.x, this.y, false, this.unbreakable));
      } else {
        this.x = 6.25 + ((i % 3) * 50) * 1.25;
        this.y = 6 + ((i % 4) * 10) * 2;
        levelTwoArray.push(new Block(this.x, this.y));
      }
    }

    for (let i = 0; i < 12; i++) {
      if (i === 7) {
        this.unbreakable = true;
        this.x = 312.5 + (6.25 + ((i % 3) * 50) * 1.25);
        this.y = 6 + ((i % 4) * 10) * 2;
        levelTwoArray.push(new Block(this.x, this.y, false, this.unbreakable));
      } else {
        this.x = 312.5 + (6.25 + ((i % 3) * 50) * 1.25);
        this.y = 6 + ((i % 4) * 10) * 2;
        levelTwoArray.push(new Block(this.x, this.y));
      }
    }

    levelTwoArray = this.randomSpecialBlocks(levelTwoArray, 2);
    return levelTwoArray;
  }

  buildLevelThree() {
    let levelThreeArray = [];

    for (let i = 0; i < 6; i++) {
      this.x = 193.75 + ((i % 2) * 50) * 1.25;
      this.y = 125 + ((i % 3) * 10) * 2;
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
        this.x = 6.25 + ((i % 3) * 50) * 1.25;
        this.y = 6 + ((i % 4) * 10) * 2;
        levelFourArray.push(new Block(this.x, this.y, false, this.unbreakable));
      } else {
        this.x = 6.25 + ((i % 3) * 50) * 1.25;
        this.y = 6 + ((i % 4) * 10) * 2;
        levelFourArray.push(new Block(this.x, this.y));
      }
    }

    for (let i = 0; i < 12; i++) {
      if (i === 3) {
        this.unbreakable = true;
        this.x = 312.5 + (6.25 + ((i % 3) * 50) * 1.25);
        this.y = 6 + ((i % 4) * 10) * 2;
        levelFourArray.push(new Block(this.x, this.y, false, this.unbreakable));
      } else {
        this.x = 312.5 + (6.25 + ((i % 3) * 50) * 1.25);
        this.y = 6 + ((i % 4) * 10) * 2;
        levelFourArray.push(new Block(this.x, this.y));
      }
    }

    for (let i = 0; i < 12; i++) {
      if (i === 7) {
        this.unbreakable = true;
        this.x = 156.25 + (6.25 + ((i % 3) * 50) * 1.25);
        this.y = 88 + (6 + ((i % 4) * 10) * 2);
        levelFourArray.push(new Block(this.x, this.y, false, this.unbreakable));
      } else {
        this.x = 156.25 + (6.25 + ((i % 3) * 50) * 1.25);
        this.y = 88 + (6 + ((i % 4) * 10) * 2);
        levelFourArray.push(new Block(this.x, this.y));
      }
    }

    for (let i = 0; i < 12; i++) {
      this.x = 6.25 + ((i % 3) * 50) * 1.25;
      this.y = 172 + (6 + ((i % 4) * 10) * 2);
      levelFourArray.push(new Block(this.x, this.y));
    }

    for (let i = 0; i < 12; i++) {
      this.x = 312.5 + (6.25 + ((i % 3) * 50) * 1.25);
      this.y = 172 + (6 + ((i % 4) * 10) * 2);
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
      if (ball.y + 6 >= array[i].y
          && ball.y - 6 <= array[i].y + 10
          && ball.x <= array[i].x + 50
          && ball.x >= array[i].x) {
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
