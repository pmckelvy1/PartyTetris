var Board = require('./board');
Board.HEIGHT = 20;
Board.WIDTH = 10;

var Game_SPEED = 1500; // ms

var TetrisGame = (window.TetrisGame ||  {});

var View = function ($viewEl) {
  this.board = new Board();
  this.$view = $viewEl;
  this.$nextBlock = $('.next-block');
  this.$heldBlock = $('.held-block');
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
    if (this.stepCounter >= 5) {
      this.gameStepMacro();
      this.stepCounter = 0;
    }
    this.render();
    if (this.gameOverBool) {
      clearInterval(this.int);
    }
  }.bind(this), 60)
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
    debugger
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
  var x, y, $ul, $li, id;
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
    this.$heldBlock.append($ul2);
  }
};

View.prototype.render = function () {
  this.renderBlocks();
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
    this.$view.find(gridId).addClass(klass).css('background', this.board.blocks[id].color);
  };
  this.renderPlayBlock();
  this.renderNextBlock();
};

View.prototype.renderPlayBlock = function () {
  this.board.playBlock.coords.forEach(function (coord) {
    var id = coord[0] * 100 + coord[1];
    var gridId = '#' + id;
    var klass = 'grid-point block';
    this.$view.find(gridId).addClass(klass).css('background', this.board.playBlock.color);
  }.bind(this));
};

View.prototype.renderNextBlock = function () {
  var id;
  this.$nextBlock.find('li').css('background', '#000');
  this.board.nextBlock.spawnCoords.forEach(function (coord) {
    id = '#nb' + (coord[1] * 100 + coord[0]);
    this.$nextBlock.find(id).css('background', this.board.nextBlock.color);
  }.bind(this));
};

View.prototype.renderHoldBlock = function () {

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
      // SWAP HOLDBLOCK AND PLAYBLOCK
    default:
    return;
  }
};

module.exports = View;
