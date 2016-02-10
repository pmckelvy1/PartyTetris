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
