/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/js/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(1);
	
	$(function () {
	  var $viewEl = $('.tetris-game');
	  var tetrisView = new View($viewEl);
	})


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	Board.HEIGHT = 20;
	Board.WIDTH = 10;
	
	var Game_SPEED = 1500; // ms
	
	var TetrisGame = (window.TetrisGame ||  {});
	
	var View = function ($viewEl) {
	  this.board = new Board();
	  this.$view = $viewEl;
	  this.setupGrid(Board.WIDTH, Board.HEIGHT);
	  this.bindKeyEvents();
	  this.gameLoopMacro = setInterval(function() {
	    if (this.gameLoopMicro) {
	      clearInterval(this.gameLoopMicro);
	    }
	    this.gameStepMacro();
	    this.gameLoopMicro = setInterval(function () {
	      this.render();
	    }.bind(this), 60)
	  }.bind(this), Game_SPEED);
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
	
	View.prototype.gameStepMacro = function () {
	  this.board.step();
	  if (this.board.gameOver()) {
	    this.gameOver();
	  }
	};
	
	View.prototype.gameOver = function () {
	  clearInterval(this.gameLoopMicro);
	  clearInterval(this.gameLoopMacro);
	}
	
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
	
	View.prototype.render = function () {
	  this.renderBlocks();
	};
	
	View.prototype.renderBlocks = function () {
	  this.$view.find(".block").removeClass();
	  this.$view.find(".block").addClass(".grid-point");
	  var gridId;
	  var gridPoint;
	  var klass;
	  for (var id in this.board.blocks) {
	    gridId = '#' + id;
	    klass = 'grid-point block ' + this.board.blocks[id].color;
	    this.$view.find(gridId).addClass(klass);
	  };
	  this.renderPlayBlock();
	};
	
	View.prototype.renderPlayBlock = function () {
	  this.board.playBlock.coords.forEach(function (coord) {
	    var id = coord[0] * 100 + coord[1];
	    var gridId = '#' + id;
	    var klass = 'grid-point block ' + this.board.playBlock.color;
	    this.$view.find(gridId).addClass(klass);
	  }.bind(this));
	};
	
	View.prototype.renderNextBlock = function () {
	
	};
	
	View.prototype.renderHoldBlock = function () {
	
	};
	
	View.prototype.bindKeyEvents = function () {
	  $(document).keydown(this.handleKeyEvent.bind(this));
	};
	
	View.prototype.handleKeyEvent = function (e) {
	  switch(e.which) {
	    case 38: //up = rotate
	      this.board.playBlock.turn();
	    break;
	    case 39: //right = move right
	      this.board.playBlock.move([1,0]);
	    break;
	    case 40: //down = land
	      // SPEED UP GAME
	    break;
	    case 37: //left = move left
	      this.board.playBlock.move([-1,0]);
	    break;
	    case 32: //spacebar = hold block
	      // SWAP HOLDBLOCK AND PLAYBLOCK
	    default:
	    return;
	  }
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(3);
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	
	var Tetris = window.Tetris = (window.Tetris || {});
	
	Board.WIDTH = 10;
	Board.HEIGHT = 20;
	
	var Coords = __webpack_require__(4);
	
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// coords helper function
	var Board = __webpack_require__(2);
	Board.WIDTH = 10;
	Board.HEIGHT = 20;
	
	var Coords = function () {
	
	};
	
	Coords.addCoords = function (coord1, coord2) {
	  return [coord1[0] + coord2[0], coord1[1] + coord2[1]];
	};
	
	Coords.moveCoords = function (coords, dir) {
	  return coords.map(function(coord) {
	    return Coords.addCoords(coord, dir);
	  });
	};
	
	Coords.subCoords = function (coord1, coord2) {
	  return [coord1[0] - coord2[0], coord1[1] - coord2[1]];
	};
	
	Coords.equals = function (coord1, coord2) {
	  return (coord1[0] === coord2[0] && coord1[1] === coord2[1]);
	};
	
	Coords.outOfBounds = function (coords) {
	  var outOfBounds = false;
	  coords.forEach(function (coord) {
	    if (coord[0] >= Board.HEIGHT) {
	      outOfBounds = true;
	    } else if (coord[1] >= Board.WIDTH) {
	      outOfBounds = true;
	    } else if (coord[0] < 0) {
	      outOfBounds = true;
	    } else if (coord[1] < 0) {
	      outOfBounds = true;
	    }
	  });
	  return outOfBounds;
	};
	
	Coords.rotate = function (coords, origin) {
	  var newCoords = coords.map(function (coord) {
	    return Coords.subCoords(coord, origin);
	  });
	  var rotatedCoords = newCoords.map(function (coord) {
	    return [coord[1], -coord[0]];
	  });
	  return rotatedCoords.map(function (coord) {
	    return Coords.addCoords(coord, origin);
	  });
	};
	
	module.exports = Coords;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map