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
	    console.log('loop');
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(3);
	var Coords = __webpack_require__(4);
	var Util = __webpack_require__(5);
	
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
	
	Block.prototype.move = function (dir) {
	  this.coords = Coords.moveCoords(this.coords, dir);
	};
	
	Block.prototype.turn = function () {
	  this.coords = Coords.rotate(this.coords, this.coords[2]);
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
	
	Tetris.Square.prototype.turn = function () {};
	
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
	    if (coord[0] >= Board.WIDTH) {
	      outOfBounds = true;
	    } else if (coord[1] >= Board.HEIGHT) {
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	var Util = {
	  selectRandomColor: function () {
	    var x, y, z;
	    var color;
	    var variable = Math.floor(Math.random() * 135) + 110;
	    var choose = Math.floor(Math.random() * 5.9999999999);
	    switch (choose) {
	      case 0:
	        var color = 'rgb(110, 245, ' + variable + ')';
	        break;
	      case 1:
	        var color = 'rgb(245, 110, ' + variable + ')';
	        break;
	      case 2:
	        var color = 'rgb(110, ' + variable + ', 245)';
	        break;
	      case 3:
	        var color = 'rgb(245, ' + variable + ', 110)';
	        break;
	      case 4:
	        var color = 'rgb(' + variable + ', 110, 245)';
	        break;
	      case 5:
	        var color = 'rgb(' + variable + ', 245, 110)';
	        break;
	    }
	    return color;
	  }
	};
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map