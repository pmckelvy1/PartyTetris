var Board = require('./board');
var TetrisUtil = require('./util');

var Tetris = window.Tetris = (window.Tetris || {});
Tetris.Util = new TetrisUtil();


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
  });
};

Block.prototype.move = function (dir) {
  this.coords = Coords.moveCoords(this.coords, dir);
};

Block.prototype.turn = function () {
  this.coords = Coords.rotate(this.coords, this.coords[2]);
};

Block.prototype.putInPlay = function () {
  this.coords = [];
  this.spawnCoords.forEach(function(coord) {
    this.coords.push(coord.slice());
  }.bind(this));
};

Block.prototype.yMovement = function () {
  var lowest = 0;
  this.coords.forEach(function (coord) {
    if (coord[1] > lowest) {
      lowest = coord[1];
    }
  });
  return lowest - 3;
};

Block.prototype.xMovement = function () {
  var leftest = 9;
  this.coords.forEach(function (coord) {
    if (coord[0] < leftest) {
      leftest = coord[0];
    }
  });
  if (leftest === 7) {
    leftest -= 1;
  } else if (leftest === 0) {
    leftest += 1;
  }
  return leftest - 4;
};

Block.prototype.updateColor = function () {
  this.color = Tetris.Util.updateColor();
};

// INHERITS FUNCITON
var inherits = function (subClass, superClass) {
  var Surrogate = function () {};
  Surrogate.prototype = superClass.prototype;
  subClass.prototype = new Surrogate();
  subClass.prototype.constructor = subClass;
};

var Square = Tetris.Square = function (color, border) {
  this.spawnCoords = [[4,2], [5,2], [4,3], [5,3]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

var Zig = Tetris.Zig = function (color, border) {
  this.spawnCoords = [[4,2], [5,2], [5,3], [6,3]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

var Zag = Tetris.Zag = function (color, border) {
  this.spawnCoords = [[4,3], [5,3], [5,2], [6,2]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

var Tee = Tetris.Tee = function (color, border) {
  this.spawnCoords = [[4,2], [5,2], [5,3], [6,2]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

var El = Tetris.El = function (color, border) {
  this.spawnCoords = [[4,2], [4,3], [5,3], [6,3]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

var Le = Tetris.Le = function (color, border) {
  this.spawnCoords = [[3,3], [4,3], [5,3], [5,2]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

var Line = Tetris.Line = function (color, border) {
  this.spawnCoords = [[3,2], [4,2], [5,2], [6,2]];
  this.coords = [];
  this.color = color;
  this.border = border;
};

inherits(Tetris.Square, Tetris.Block);
inherits(Tetris.Zig, Tetris.Block);
inherits(Tetris.Zag, Tetris.Block);
inherits(Tetris.Tee, Tetris.Block);
inherits(Tetris.El, Tetris.Block);
inherits(Tetris.Le, Tetris.Block);
inherits(Tetris.Line, Tetris.Block);

Tetris.Square.prototype.turn = function () {};

Block.BLOCKS = [Square, Zig, Zag, Tee, El, Le, Line];


module.exports = Block;
