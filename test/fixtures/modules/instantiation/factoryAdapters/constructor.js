'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/factoryAdapters/constructor'
};

var index = 0;

module.exports._constructor = function () {
  this.me = 'instantiation/factoryAdapters/constructor';
  this.index = index;
  index+=1;
};

module.exports._constructor.prototype.getMe = function () {
  return this.me;
};
