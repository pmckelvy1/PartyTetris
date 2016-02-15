var Board = require('./board');
var Util = require('./util');

Board.HEIGHT = 20;
Board.WIDTH = 10;

var Game_SPEED = 1500; // ms

var Tetris = window.Tetris = (window.Tetris || {});

var View = function ($lviewEl) {
  this.board = new Board();
  this.$lview = $lviewEl;
  this.$ltitle = $l('.title');
  this.$lscoreBox = $l('.score-box');
  this.$lscore = $l('.score');
  this.$lgameOver = $l('.game-over');
  this.$ltetrisGame = $l('.tetris-game');
  this.$llevelUp = $l('.level-up');
  this.$llevelNum = $l('.level-num');
  this.$llevel = $l('.level');
  this.$lnextBlock = $l('.next-block');
  this.$lholdBlock = $l('.hold-block');
  this.$lcontrols = $l('.controls');
  this.$lplayAgain = $l('.play-again');
  this.$lgameStart = $l('.game-start');
  this.$linfo = $l('.info');
  this.nextLevelValue = 1000;
  this.levelSpeedValue = 10;
  this.setupGrid(Board.WIDTH, Board.HEIGHT);
  this.setupBoxes(6, 6);
  this.bindKeyEvents();
  this.gameOverBool = false;
  this.gameStart = false;
  this.stepCounter = 0;
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

View.prototype.init = function () {
  this.nextLevelValue = 1000;
  this.levelSpeedValue = 10;
  this.gameOverBool = false;
  this.stepCounter = 0;
};

View.prototype.reset = function () {
  this.$lgameOver.css('display', 'none');
  this.$lplayAgain.css('display', 'none');
  this.board.init();
  this.init();
  this.gameLoopMacro();
};

View.prototype.gameStartFn = function () {
  this.gameStart = true;
  this.$lgameStart.css('display', 'none');
  this.board.init();
  this.init();
  this.gameLoopMacro();
};

View.prototype.levelUp = function () {
  this.levelSpeedValue -= 1;
  this.nextLevelValue *= 2;
  this.renderLevelUp();
};

View.prototype.gameStepMacro = function () {
  if (this.board.gameOver()) {
    this.gameOver();
  } else {
    this.board.step();
  }
};

View.prototype.gameOver = function () {
  this.gameOverBool = true;
};

View.prototype.setupGrid = function (width, height) {
  var x, y, $lul, $lli, id;
  for (x = 0; x < width; x++) {
    $lul = $l("<ul>");
    $lul.addClass("column group");
    for (y = 0; y < height; y++) {
      $lli = $l("<li>");
      $lli.addClass("grid-point");
      id = 's' + (x * 100 + y);
      $lli.attr('id', id);
      $lul.append($lli);
    }
    this.$lview.append($lul);
  }
};

View.prototype.setupBoxes = function (width, height) {
  var x, y, $lul1, $lul2, $lli1, $lli2, id1, id2;
  for (x = 2; x < width + 2; x++) {
    $lul1 = $l("<ul>");
    $lul1.addClass("group");
    $lul2 = $l("<ul>");
    $lul2.addClass("group");
    for (y = 0; y < height; y++) {
      $lli1 = $l("<li>");
      $lli1.addClass("grid-point");
      $lli2 = $l("<li>");
      $lli2.addClass("grid-point");
      id1 = 'nb' + (y * 100 + x);
      id2 = 'hb' + (y * 100 + x);
      $lli1.attr('id', id1);
      $lli2.attr('id', id2);
      $lul1.append($lli1);
      $lul2.append($lli2);
    }
    this.$lnextBlock.append($lul1);
    this.$lholdBlock.append($lul2);
  }
};

View.prototype.render = function () {
  this.renderBlocks();
  this.renderScore();
  this.renderTitle();
  this.renderBorder();
  this.renderControls();
  this.renderLevel();
  this.renderInfo();
};

View.prototype.renderBlocks = function () {
  $l('.block').removeClass('block');
  $l('.grid-point').css('background', '#000');
  var gridId;
  var gridPoint;
  var klass;
  for (var id in this.board.blocks) {
    gridId = '#s' + id;
    klass = 'block';
    var blockEl = this.$lview.find(gridId);
    blockEl.addClass(klass);
    blockEl.css('background', this.board.blocks[id].color);
  }
  this.renderPlayBlock();
  this.renderNextBlock();
  this.renderHoldBlock();
};

View.prototype.renderTitle = function () {
  this.$ltitle.css('color', Tetris.Util.getColor());
};

View.prototype.renderPlayBlock = function () {
  this.board.playBlock.coords.forEach(function (coord) {
    var id = coord[0] * 100 + coord[1];
    var gridId = '#s' + id;
    var klass = 'grid-point block';
    var blockEl = this.$lview.find(gridId);
    blockEl.addClass(klass);
    blockEl.css('background', this.board.playBlock.color);
  }.bind(this));
};

View.prototype.renderNextBlock = function () {
  var id;
  this.$lnextBlock.find('li').css('background', '#000');
  var klass = 'grid-point block';
  this.board.nextBlock.spawnCoords.forEach(function (coord) {
    id = '#nb' + (coord[1] * 100 + coord[0]);
    var blockEl = this.$lnextBlock.find(id)
    blockEl.addClass(klass);
    blockEl.css('background', this.board.nextBlock.color);
  }.bind(this));
};

View.prototype.renderHoldBlock = function () {
  var id;
  this.$lholdBlock.find('li').css('background', '#000');
  var klass = 'grid-point block';
  this.board.holdBlock.spawnCoords.forEach(function (coord) {
    id = '#hb' + (coord[1] * 100 + coord[0]);
    var blockEl = this.$lholdBlock.find(id);
    blockEl.addClass(klass);
    blockEl.css('background', this.board.holdBlock.color);
  }.bind(this));
};

View.prototype.renderScore = function () {
  this.$lscoreBox.html(this.board.score);
  this.$lscoreBox.css('color', Tetris.Util.getColor());
  this.$lscore.css('color', Tetris.Util.getColor());
};

View.prototype.renderLevel = function () {
  var level = 11 - this.levelSpeedValue;
  this.$llevelNum.html(level);
  this.$llevelNum.css('color', Tetris.Util.getColor());
  this.$llevel.css('color', Tetris.Util.getColor());
};

View.prototype.renderBorder = function () {
  this.$ltetrisGame.css('border-color', Tetris.Util.getColor());
};

View.prototype.renderControls = function () {
  var controlsEl = this.$lcontrols.find('.control');
  controlsEl.css('color', Tetris.Util.getColor());
};

View.prototype.renderGameOver = function () {
  this.$lgameOver.css('display', 'block');
  this.$lplayAgain.css('display', 'block');
};

View.prototype.renderLevelUp = function () {
  this.$llevelUp.css('display', 'block');
  setTimeout(function () {
    this.$llevelUp.css('display', 'none');
  }.bind(this), 1500);
};

View.prototype.renderInfo = function () {
  this.$linfo.css('color', Tetris.Util.getColor());
};

View.prototype.bindKeyEvents = function () {
  var doc = $l(document);
  doc.on('keydown', this.handleKeyEvent.bind(this));
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
      // this.board.move([0,1]);
      this.board.land();
      break;
    case 37: //left = move left
      this.board.move([-1,0]);
      break;
    case 32: //spacebar = hold block
      this.board.swapBlocks();
      break;
    case 13:
      if (this.gameOverBool) {
        this.reset();
      } else if (!this.gameStart) {
        this.gameStartFn();
      }
      break;
  }
};

module.exports = View;
