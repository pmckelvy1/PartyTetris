// coords helper function
Board.WIDTH = 10;
Board.HEIGHT = 20;

var Coords = function () {

};

Coords.prototype.addCoords = function (coord1, coord2) {
  return [coord1[0] + coord2[0], coord1[1] + coord2[1]];
};

Coords.prototype.subCoords = function (coord1, coord2) {
  return [coord1[0] - coord2[0], coord1[1] - coord2[1]];
};

Coords.prototype.equals = function (coord1, coord2) {
  return (coord1[0] === coord2[0] && coord1[1] === coord2[1]);
};

Coords.prototype.outOfBounds = function (coords) {
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

Coords.prototype.rotate = function (coords, origin) {
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
