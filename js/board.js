var Block = require('./blocks');

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
  this.nextBlock = new nextBlock('#0BF');

  seed = Math.round(Math.random() * 6);
  nextBlock = Block.BLOCKS[seed];
  this.playBlock = new nextBlock('#0BF');
  this.playBlock.putInPlay();
};

// BOARD FUNCTIONS
//////////////////

// canSpawnBlock
// spawnBlock
// gameOver
// willLand

Board.prototype.step = function () {
  if (this.playBlock.canDropOne()) {
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
  if (!testBlock.canDropOne()) {
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
  this.nextBlock = new nextBlock();
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

module.exports = Board;
