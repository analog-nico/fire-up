'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/factoryAdapters/constructorMultiple',
  type: 'multiple instances'
};

var index = 0;

module.exports._constructor = function () {
  this.me = 'instantiation/factoryAdapters/constructorMultiple';
  this.index = index;
  index+=1;
};

module.exports._constructor.prototype.getMe = function () {
  return this.me;
};
