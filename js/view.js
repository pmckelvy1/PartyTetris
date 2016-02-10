var Board = require('./board');
var Util = require('./util');

Board.HEIGHT = 20;
Board.WIDTH = 10;

var Game_SPEED = 1500; // ms

var Tetris = window.Tetris = (window.Tetris || {});

var View = function ($viewEl) {
  this.board = new Board();
  this.$view = $viewEl;
  this.$title = $('.title');
  this.$scoreBox = $('.score-box');
  this.$score = $('.score');
  this.$gameOver = $('.game-over');
  this.$tetrisGame = $('.tetris-game');
  this.$levelUp = $('.level-up');
  this.$levelNum = $('.level-num');
  this.$level = $('.level');
  this.nextLevelValue = 1000;
  this.$nextBlock = $('.next-block');
  this.$holdBlock = $('.hold-block');
  this.$controls = $('.controls');
  this.levelSpeedValue = 10;
  this.setupGrid(Board.WIDTH, Board.HEIGHT);
  this.setupBoxes(6, 6);
  this.bindKeyEvents();
  this.gameOverBool = false;
  this.stepCounter = 0;
  this.gameLoopMacro();
};


// VIEW FUNCTIONS
/////////////////

// bindKeyEvents
// handleKeyEvent
// render
// renderBlocks
// renderBlock(brick)
// renderHoldBlock
// renderNextBlock
// renderScore
// setupGrid
// stepMicro
// stepMacro
// speedUp
// slowDown
// gameStep


View.prototype.gameLoopMacro = function() {
  this.int = setInterval(function () {
    this.stepCounter += 1;
    if (this.stepCounter >= this.levelSpeedValue) {
      this.gameStepMacro();
      this.stepCounter = 0;
    }
    this.board.playBlock.updateColor();
    if (this.board.score >= this.nextLevelValue) {
      this.levelUp();
    }
    this.render();
    if (this.gameOverBool) {
      clearInterval(this.int);
      this.renderGameOver();
    }
  }.bind(this), 60);
};

View.prototype.levelUp = function () {
  console.log('levelup');
  this.levelSpeedValue -= 1;
  this.nextLevelValue *= 2;
  this.renderLevelUp();
};
// View.prototype.gameLoopMacro = function() {
//   this.stepCounter += 1;
//   if (this.stepCounter >= 50) {
//     this.gameStepMacro();
//     this.stepCounter = 0;
//   }
//   this.render();
//   if (!this.gameOverBool) {
//     window.requestAnimationFrame(this.gameLoopMacro.bind(this));
//   }
// };

View.prototype.gameStepMacro = function () {
  if (this.board.gameOver()) {
    console.log('gameover');
    this.gameOver();
  } else {
    this.board.step();
  }
};

View.prototype.gameOver = function () {
  this.gameOverBool = true;
};

View.prototype.setupGrid = function (width, height) {
  var x, y, $ul, $li, id;
  for (x = 0; x < width; x++) {
    $ul = $("<ul>").addClass("column group");
    for (y = 0; y < height; y++) {
      $li = $("<li>").addClass("grid-point");
      id = x * 100 + y;
      $li.attr('id', id);
      $ul.append($li);
    }
    this.$view.append($ul);
  }
};

View.prototype.setupBoxes = function (width, height) {
  var x, y, $ul1, $ul2, $li1, $li2, id1, id2;
  for (x = 2; x < width + 2; x++) {
    $ul1 = $("<ul>").addClass("group");
    $ul2 = $("<ul>").addClass("group");
    for (y = 0; y < height; y++) {
      $li1 = $("<li>").addClass("grid-point");
      $li2 = $("<li>").addClass("grid-point");
      id1 = 'nb' + (y * 100 + x);
      id2 = 'hb' + (y * 100 + x);
      $li1.attr('id', id1);
      $li2.attr('id', id2);
      $ul1.append($li1);
      $ul2.append($li2);
    }
    this.$nextBlock.append($ul1);
    this.$holdBlock.append($ul2);
  }
};

View.prototype.render = function () {
  this.renderBlocks();
  this.renderScore();
  this.renderTitle();
  this.renderBorder();
  this.renderControls();
  this.renderLevel();
};

View.prototype.renderBlocks = function () {
  $('.block').removeClass('block');
  $('.grid-point').css('background', '#000');
  var gridId;
  var gridPoint;
  var klass;
  for (var id in this.board.blocks) {
    gridId = '#' + id;
    klass = 'block';
    this.$view.find(gridId).addClass(klass)
      .css('background', this.board.blocks[id].color);
  }
  this.renderPlayBlock();
  this.renderNextBlock();
  this.renderHoldBlock();
};

View.prototype.renderTitle = function () {
  this.$title.css('color', Tetris.Util.getColor());
};

View.prototype.renderPlayBlock = function () {
  this.board.playBlock.coords.forEach(function (coord) {
    var id = coord[0] * 100 + coord[1];
    var gridId = '#' + id;
    var klass = 'grid-point block';
    this.$view.find(gridId).addClass(klass)
      .css('background', this.board.playBlock.color);
  }.bind(this));
};

View.prototype.renderNextBlock = function () {
  var id;
  this.$nextBlock.find('li').css('background', '#000');
  var klass = 'grid-point block';
  this.board.nextBlock.spawnCoords.forEach(function (coord) {
    id = '#nb' + (coord[1] * 100 + coord[0]);
    this.$nextBlock.find(id).addClass(klass)
      .css('background', this.board.nextBlock.color);
  }.bind(this));
};

View.prototype.renderHoldBlock = function () {
  var id;
  this.$holdBlock.find('li').css('background', '#000');
  var klass = 'grid-point block';
  this.board.holdBlock.spawnCoords.forEach(function (coord) {
    id = '#hb' + (coord[1] * 100 + coord[0]);
    this.$holdBlock.find(id).addClass(klass)
      .css('background', this.board.holdBlock.color);
  }.bind(this));
};

View.prototype.renderScore = function () {
  this.$scoreBox.html(this.board.score);
  this.$scoreBox.css('color', Tetris.Util.getColor());
  this.$score.css('color', Tetris.Util.getColor());
};

View.prototype.renderLevel = function () {
  var level = 11 - this.levelSpeedValue;
  this.$levelNum.html(level);
  this.$levelNum.css('color', Tetris.Util.getColor());
  this.$level.css('color', Tetris.Util.getColor());
};

View.prototype.renderBorder = function () {
  this.$tetrisGame.css('border-color', Tetris.Util.getColor());
};

View.prototype.renderControls = function () {
  this.$controls.find('.control').css('color', Tetris.Util.getColor());
};

View.prototype.renderGameOver = function () {
  this.$gameOver.css('display', 'block');
};

View.prototype.renderLevelUp = function () {
  this.$levelUp.css('display', 'block');
  setTimeout(function () {
    this.$levelUp.css('display', 'none');
  }.bind(this), 1500);
};

View.prototype.bindKeyEvents = function () {
  $(document).keydown(this.handleKeyEvent.bind(this));
};

View.prototype.handleKeyEvent = function (e) {
  switch(e.which) {
    case 38: //up = rotate
      this.board.turn();
      break;
    case 39: //right = move right
      this.board.move([1,0]);
      break;
    case 40: //down = land
      this.board.move([0,1]);
      break;
    case 37: //left = move left
      this.board.move([-1,0]);
      break;
    case 32: //spacebar = hold block
      this.board.swapBlocks();
      break;
    default:
    return;
  }
};

module.exports = View;
