// coords helper function
var Board = require('./board');
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
