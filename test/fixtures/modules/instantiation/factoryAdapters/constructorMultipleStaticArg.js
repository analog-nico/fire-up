'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/factoryAdapters/constructorMultipleStaticArg',
  type: 'multiple instances'
};

module.exports._constructor = function (staticArg) {
  this.staticArg = staticArg;
};
