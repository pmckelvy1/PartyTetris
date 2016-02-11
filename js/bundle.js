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
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	var Util = __webpack_require__(5);
	
	Board.HEIGHT = 20;
	Board.WIDTH = 10;
	
	var Game_SPEED = 1500; // ms
	
	var Tetris = window.Tetris = (window.Tetris || {});
	
	var View = function ($viewEl) {
	  this.board = new Board();
	  this.$view = $viewEl;
	  this.$title = $('.title');
	  this.$scoreBox = $('.score-box');
	  this.$score = $('.score');
	  this.$gameOver = $('.game-over');
	  this.$tetrisGame = $('.tetris-game');
	  this.$levelUp = $('.level-up');
	  this.$levelNum = $('.level-num');
	  this.$level = $('.level');
	  this.$nextBlock = $('.next-block');
	  this.$holdBlock = $('.hold-block');
	  this.$controls = $('.controls');
	  this.$playAgain = $('.play-again');
	  this.nextLevelValue = 1000;
	  this.levelSpeedValue = 10;
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
	  this.$gameOver.css('display', 'none');
	  this.$playAgain.css('display', 'none');
	  this.board.init();
	  this.init();
	  this.gameLoopMacro();
	};
	
	View.prototype.levelUp = function () {
	  console.log('levelup');
	  this.levelSpeedValue -= 1;
	  this.nextLevelValue *= 2;
	  this.renderLevelUp();
	};
	
	View.prototype.gameStepMacro = function () {
	  if (this.board.gameOver()) {
	    console.log('gameover');
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
	  var x, y, $ul1, $ul2, $li1, $li2, id1, id2;
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
	    this.$holdBlock.append($ul2);
	  }
	};
	
	View.prototype.render = function () {
	  this.renderBlocks();
	  this.renderScore();
	  this.renderTitle();
	  this.renderBorder();
	  this.renderControls();
	  this.renderLevel();
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
	    this.$view.find(gridId).addClass(klass)
	      .css('background', this.board.blocks[id].color);
	  }
	  this.renderPlayBlock();
	  this.renderNextBlock();
	  this.renderHoldBlock();
	};
	
	View.prototype.renderTitle = function () {
	  this.$title.css('color', Tetris.Util.getColor());
	};
	
	View.prototype.renderPlayBlock = function () {
	  this.board.playBlock.coords.forEach(function (coord) {
	    var id = coord[0] * 100 + coord[1];
	    var gridId = '#' + id;
	    var klass = 'grid-point block';
	    this.$view.find(gridId).addClass(klass)
	      .css('background', this.board.playBlock.color);
	  }.bind(this));
	};
	
	View.prototype.renderNextBlock = function () {
	  var id;
	  this.$nextBlock.find('li').css('background', '#000');
	  var klass = 'grid-point block';
	  this.board.nextBlock.spawnCoords.forEach(function (coord) {
	    id = '#nb' + (coord[1] * 100 + coord[0]);
	    this.$nextBlock.find(id).addClass(klass)
	      .css('background', this.board.nextBlock.color);
	  }.bind(this));
	};
	
	View.prototype.renderHoldBlock = function () {
	  var id;
	  this.$holdBlock.find('li').css('background', '#000');
	  var klass = 'grid-point block';
	  this.board.holdBlock.spawnCoords.forEach(function (coord) {
	    id = '#hb' + (coord[1] * 100 + coord[0]);
	    this.$holdBlock.find(id).addClass(klass)
	      .css('background', this.board.holdBlock.color);
	  }.bind(this));
	};
	
	View.prototype.renderScore = function () {
	  this.$scoreBox.html(this.board.score);
	  this.$scoreBox.css('color', Tetris.Util.getColor());
	  this.$score.css('color', Tetris.Util.getColor());
	};
	
	View.prototype.renderLevel = function () {
	  var level = 11 - this.levelSpeedValue;
	  this.$levelNum.html(level);
	  this.$levelNum.css('color', Tetris.Util.getColor());
	  this.$level.css('color', Tetris.Util.getColor());
	};
	
	View.prototype.renderBorder = function () {
	  this.$tetrisGame.css('border-color', Tetris.Util.getColor());
	};
	
	View.prototype.renderControls = function () {
	  this.$controls.find('.control').css('color', Tetris.Util.getColor());
	};
	
	View.prototype.renderGameOver = function () {
	  this.$gameOver.css('display', 'block');
	  this.$playAgain.css('display', 'block');
	};
	
	View.prototype.renderLevelUp = function () {
	  this.$levelUp.css('display', 'block');
	  setTimeout(function () {
	    this.$levelUp.css('display', 'none');
	  }.bind(this), 1500);
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
	      }
	      break;
	  }
	};
	
	module.exports = View;


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Block = __webpack_require__(3);
	var Coords = __webpack_require__(4);
	var TetrisUtil = __webpack_require__(5);
	var Util = new TetrisUtil();
	
	var Board = function () {
	  this.init();
	};
	
	Board.prototype.init = function () {
	  this.score = 0;
	  this.blocks = {};
	  this.playBlock = {};
	  this.holdBlock = {};
	  this.nextBlock = {};
	
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
	  this.score += 100;
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
	
	Board.prototype.land = function () {
	  while (this.canMove(this.playBlock, [0,1])) {
	    this.playBlock.move([0,1]);
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
	  this.score += (500 * linesToDelete.length) * linesToDelete.length;
	
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


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var Board = __webpack_require__(2);
	var TetrisUtil = __webpack_require__(5);
	
	var Tetris = window.Tetris = (window.Tetris || {});
	Tetris.Util = new TetrisUtil();
	
	
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

	var Util = function () {
	  this.x = 110;
	  this.y = 110;
	  this.z = 245;
	  this.changing = '+x';
	};
	
	Util.prototype.updateColor = function () {
	  switch(this.changing) {
	    case '+x':
	      this.x += 5;
	      if (this.x === 245) {
	        this.changing = '-z';
	      }
	      break;
	    case '-z':
	      this.z -= 5;
	      if (this.z === 110) {
	        this.changing = '+y';
	      }
	      break;
	    case '+y':
	      this.y += 5;
	      if (this.y === 245) {
	        this.changing = '-x';
	      }
	      break;
	    case '-x':
	      this.x -= 5;
	      if (this.x === 110) {
	        this.changing = '+z';
	      }
	      break;
	    case '+z':
	      this.z += 5;
	      if (this.z === 245) {
	        this.changing = '-y';
	      }
	      break;
	    case '-y':
	      this.y -= 5;
	      if (this.y === 110) {
	        this.changing = '+x';
	      }
	      break;
	  }
	  return 'rgb(' + this.x + ',' + this.y + ',' + this.z + ')';
	};
	
	Util.prototype.getColor = function () {
	  return 'rgb(' + this.x + ',' + this.y + ',' + this.z + ')';
	};
	
	
	Util.prototype.selectRandomColor = function () {
	    var x, y, z;
	    var color;
	    var border;
	    var variable = Math.floor(Math.random() * 135) + 110;
	    var choose = Math.floor(Math.random() * 5.9999999999);
	    switch (choose) {
	      case 0:
	        color = 'rgb(110, 245, ' + variable + ')';
	        break;
	      case 1:
	        color = 'rgb(245, 110, ' + variable + ')';
	        break;
	      case 2:
	        color = 'rgb(110, ' + variable + ', 245)';
	        break;
	      case 3:
	        color = 'rgb(245, ' + variable + ', 110)';
	        break;
	      case 4:
	        color = 'rgb(' + variable + ', 110, 245)';
	        break;
	      case 5:
	        color = 'rgb(' + variable + ', 245, 110)';
	        break;
	    }
	    return color;
	  };
	
	module.exports = Util;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map