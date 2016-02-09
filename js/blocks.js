var Board = require('./board');

var Tetris = window.Tetris = (window.Tetris || {});

Board.WIDTH = 10;
Board.HEIGHT = 20;

var Coords = require('./coords');

var Block = Tetris.Block = function (hashColor) {
};

// BLOCK GENERIC FUNCTIONS
//////////////////////////
// move
// canMove
// turn
// canTurn
// dropOne
// canDropOne
// putInPlay


Block.prototype.dropOne = function () {
  this.coords = this.coords.map(function (coord) {
    return Coords.addCoords(coord, [0, 1]);
  })
};

Block.prototype.canDropOne = function () {
  var canDropOne = true;
  var testCoords = this.coords.map(function(coord) {
    return coord.slice();
  });
  testCoords = Coords.moveCoords(testCoords, [0, 1]);

  // TEST FOR OUT OF BOUNDS
  if (Coords.outOfBounds(testCoords)) {
    canDropOne = false;
  };

  // TEST FOR LANDED ON BLOCK
  var $gridPoint;
  var id;
  testCoords.forEach(function(coord) {
    id = coord[0] * 100 + coord[1];
    id = '#' + id;
    $gridPoint = $(id);
    if ($gridPoint.hasClass('block')) {
      canDropOne = false;
    }
  }.bind(this));
  return canDropOne;
};

Block.prototype.move = function (dir) {
  if (this.canMove(dir)) {
    this.coords = Coords.moveCoords(this.coords, dir);
  }
};

Block.prototype.canMove = function (dir) {
  var canMove = true;
  var testCoords = this.coords.slice();
  testCoords = Coords.moveCoords(testCoords, dir);
  return !Coords.outOfBounds(testCoords);
};

Block.prototype.turn = function () {
  if (this.canTurn) {
    this.coords = Coords.rotate(this.coords, this.coords[2]);
  }
};

Block.prototype.canTurn = function () {
  var canTurn = true;
  var testCoords = this.coords.slice();
  testCoords = Coords.rotate(testCoords, testCoords[2]);
  return !Coords.outOfBounds(testCoords);
};

Block.prototype.putInPlay = function () {
  this.coords = this.spawnCoords;
}

// INHERITS FUNCITON
var inherits = function (subClass, superClass) {
  var Surrogate = function () {};
  Surrogate.prototype = superClass.prototype;
  subClass.prototype = new Surrogate();
  subClass.prototype.constructor = subClass;
};

var Square = Tetris.Square = function (hashColor) {
  this.spawnCoords = [[4,2], [5,2], [4,3], [5,3]];
  this.coords = [];
  this.color = hashColor;
};

var Zig = Tetris.Zig = function (hashColor) {
  this.spawnCoords = [[4,2], [5,2], [5,3], [6,3]];
  this.coords = [];
  this.color = hashColor;
};

var Zag = Tetris.Zag = function (hashColor) {
  this.spawnCoords = [[4,3], [5,3], [5,2], [6,2]];
  this.coords = [];
  this.color = hashColor;
};

var Tee = Tetris.Tee = function (hashColor) {
  this.spawnCoords = [[4,2], [5,2], [5,3], [6,2]];
  this.coords = [];
  this.color = hashColor;
};

var El = Tetris.El = function (hashColor) {
  this.spawnCoords = [[4,2], [4,3], [5,3], [6,3]];
  this.coords = [];
  this.color = hashColor;
};

var Le = Tetris.Le = function (hashColor) {
  this.spawnCoords = [[3,3], [4,3], [5,3], [5,2]];
  this.coords = [];
  this.color = hashColor;
};

var Line = Tetris.Line = function (hashColor) {
  this.spawnCoords = [[3,2], [4,2], [5,2], [6,2]];
  this.coords = [];
  this.color = hashColor;
};

inherits(Tetris.Square, Tetris.Block);
inherits(Tetris.Zig, Tetris.Block);
inherits(Tetris.Zag, Tetris.Block);
inherits(Tetris.Tee, Tetris.Block);
inherits(Tetris.El, Tetris.Block);
inherits(Tetris.Le, Tetris.Block);
inherits(Tetris.Line, Tetris.Block);

Block.BLOCKS = [Square, Zig, Zag, Tee, El, Le, Line];


module.exports = Block;
