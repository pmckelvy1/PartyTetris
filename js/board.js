var Block = require('./blocks');
var Coords = require('./coords');
var TetrisUtil = require('./util');
var Util = new TetrisUtil();

var Board = function () {
  this.playBlock = {};
  this.holdBlock = {};
  this.nextBlock = {};
  this.blocks = {};
  this.init();
};

Board.prototype.init = function () {
  var seed = Math.floor(Math.random() * 6.9999999);
  var nextBlock = Block.BLOCKS[seed];

  var color = Util.selectRandomColor();
  this.nextBlock = new nextBlock(color);

  color = Util.selectRandomColor();
  this.holdBlock = new nextBlock(color);

  seed = Math.floor(Math.random() * 6.9999999);
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
    this.storeBlock();
    this.deleteRows();
    if (!this.gameOver()) {
      this.spawnBlock();
    }
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

Board.prototype.swapBlocks = function () {
  var temp = this.playBlock;
  var yMovement = this.playBlock.yMovement();
  var xMovement = this.playBlock.xMovement();
  this.playBlock = this.holdBlock;
  this.holdBlock = temp;
  this.playBlock.putInPlay();
  this.playBlock.coords.forEach(function(coord) {
    coord[0] += xMovement;
    coord[1] += yMovement;
  });
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
  }

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
  }

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
};

Board.prototype.deleteRows = function () {
  var id;
  var fullLine;
  var linesToDelete = [];

  // CHECK FOR ROWS TO DELETE
  for (var y = 0; y < 20; y++) {
    fullLine = true;
    for (var x = 0; x < 10; x++) {
      id = x * 100 + y;
      if (!this.blocks[id]) {
        fullLine = false;
        break;
      }
    }
    if (fullLine === true) {
      linesToDelete.push(y);
    }
  }

  // DELETE ROWS, MOVE ABOVE ROWS
  linesToDelete.forEach(function(lineYValue) {
    // DELETE ROW
    for (var i = 0; i < 10; i++) {
      id = i * 100 + lineYValue;
      delete this.blocks[id];
    }

    // MOVE ABOVE ROWS DOWN
    var newId;
    for (var j = lineYValue - 1; j >= 0; j--) {
      for (i = 0; i < 10; i++) {
        id = i * 100 + j;
        if (this.blocks[id]) {
          var blockObject = Object.assign({}, this.blocks[id]);
          delete this.blocks[id];
          blockObject.coord = Coords.addCoords(blockObject.coord, [0,1]);
          newId = blockObject.coord[0] * 100 + blockObject.coord[1];
          this.blocks[newId] = Object.assign({}, blockObject);
        }
      }
    }
  }.bind(this));
};


module.exports = Board;
