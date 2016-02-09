var Tetris = window.Tetris = (window.Tetris || {});

Board.WIDTH = 10;
Board.HEIGHT = 20;

var Coords = require('./coords');

var Block = function () {
  this.coords = [];
};

// BLOCK GENERIC FUNCTIONS
//////////////////////////
// move
// canTurn
// turn

Block.prototype.move = function () {
  this.coords = this.coords.map(function (coord) {
    return Coords.addCoords(coord, [0, -1]);
  })
};

Block.prototype.canTurn = function () {
  var canTurn = true;
  var testCoords = this.coords.slice();
  testCoords = Coords.rotate(testCoords, testCoords[2]);
  return !Coords.outOfBounds(testCoords);
};

Block.prototype.turn = function () {
  this.coords = Coords.rotate(this.coords, this.coords[2]);
};

// INHERITS FUNCITON
var inherits = function (subClass, superClass) {
  var Surrogate = function () {};
  Surrogate.prototype = superClass.prototype;
  subClass.prototype = new Surrogate();
  subClass.prototype.constructor = subClass;
};

var Square = function () {
  this.coords = [[4,17], [5,17], [4,16], [5,16]];
};

var Zig = function () {
  this.coords = [[4,17], [5,17], [5,16], [6,16]];
};

var Zag = function () {
  this.coords = [[4,16], [5,16], [5,17], [6,17]];
};

var Tee = function () {
  this.coords = [[4,17], [5,17], [5,16], [6,17]];
};

var El = function () {
  this.coords = [[4,17], [4,16], [5,16], [6,16]];
};

var Le = function () {
  this.coords = [[3,16], [4,16], [5,16], [5,17]];
};

var Line = function () {
  this.coords = [[3,17], [4,17], [5,17], [6,17]];
};

inherits(Tetris.Square, Tetris.Block);
inherits(Tetris.Zig, Tetris.Block);
inherits(Tetris.Zag, Tetris.Block);
inherits(Tetris.Tee, Tetris.Block);
inherits(Tetris.El, Tetris.Block);
inherits(Tetris.Le, Tetris.Block);
inherits(Tetris.Line, Tetris.Block);
