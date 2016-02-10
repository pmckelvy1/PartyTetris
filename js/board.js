var Block = require('./blocks');
var Coords = require('./coords');
var Util = require('./util');

var Board = function () {
  this.playBlock = {};
  this.holdBlock = {};
  this.nextBlock = {};
  this.blocks = {};
  this.init();
};

Board.prototype.init = function () {
  var seed = Math.round(Math.random() * 7);
  var nextBlock = Block.BLOCKS[seed];
  var color = Util.selectRandomColor();
  this.nextBlock = new nextBlock(color);

  seed = Math.round(Math.random() * 6);
  nextBlock = Block.BLOCKS[seed];
  color = Util.selectRandomColor();
  this.playBlock = new nextBlock(color);
  this.playBlock.putInPlay();
};

// BOARD FUNCTIONS
//////////////////

// canSpawnBlock
// spawnBlock
// gameOver
// willLand

Board.prototype.step = function () {
  if (this.canMove(this.playBlock, [0,1])) {
    this.playBlock.dropOne();
  } else {
    this.spawnBlock();
  }
};

Board.prototype.gameOver = function () {
  return !this.canSpawnBlock();
};

Board.prototype.canSpawnBlock = function () {
  var testBlock = $.extend({}, this.nextBlock);
  testBlock.putInPlay();
  var canSpawnBlock = true;
  testBlock.move([0,-1]);
  if (!this.canMove(testBlock, [0,1])) {
    canSpawnBlock = false;
  }
  return canSpawnBlock;
};

Board.prototype.spawnBlock = function () {
  var seed = Math.round(Math.random() * 7);
  var nextBlock = Block.BLOCKS[seed];
  this.storeBlock();
  this.playBlock = $.extend({}, this.nextBlock);
  this.playBlock.putInPlay();
  var color = Util.selectRandomColor();
  this.nextBlock = new nextBlock(color);
};

Board.prototype.storeBlock = function () {
  var id;
  this.playBlock.coords.forEach(function(coord) {
    id = coord[0] * 100 + coord[1];
    this.blocks[id] = { coord: coord, color: this.playBlock.color };
  }.bind(this));
};

Board.prototype.deleteBlock = function (coord) {
  var id = coord[0] * 100 + coord[1];
  delete this.blocks[id];
};

Board.prototype.canMove = function (block, dir) {
  var canMove = true;
  var testCoords = block.coords.map(function(coord) {
    return coord.slice();
  });
  testCoords = Coords.moveCoords(testCoords, dir);

  // TEST FOR OUT OF BOUNDS
  if (Coords.outOfBounds(testCoords)) {
    canMove = false;
  };

  // TEST FOR LANDED ON BLOCK
  var id;
  testCoords.forEach(function(coord) {
    id = coord[0] * 100 + coord[1];
    if (this.blocks[id]) {
      canMove = false;
    }
  }.bind(this));
  return canMove;
};

Board.prototype.move = function (dir) {
  if (this.canMove(this.playBlock, dir)) {
    this.playBlock.move(dir);
  }
};

Board.prototype.canTurn = function () {
  var canTurn = true;
  var testCoords = this.playBlock.coords.map(function(coord) {
    return coord.slice();
  });
  testCoords = Coords.rotate(testCoords, testCoords[2]);

  // TEST FOR OUT OF BOUNDS
  if (Coords.outOfBounds(testCoords)) {
    canTurn = false;
  };

  // TEST FOR LANDED ON BLOCK
  var id;
  testCoords.forEach(function(coord) {
    id = coord[0] * 100 + coord[1];
    if (this.blocks[id]) {
      canTurn = false;
    }
  }.bind(this));
  return canTurn;
};

Board.prototype.turn = function () {
  if (this.canTurn()) {
    this.playBlock.turn();
  }
}

module.exports = Board;
