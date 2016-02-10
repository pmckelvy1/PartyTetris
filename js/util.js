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
