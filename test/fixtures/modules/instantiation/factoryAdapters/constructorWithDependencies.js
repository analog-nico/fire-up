'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/factoryAdapters/constructorWithDependencies',
  inject: [
    'instantiation/factoryAdapters/constructor',
    'instantiation/factoryAdapters/constructorMultiple'
  ]
};

module.exports._constructor = function (dep1, dep2) {
  this.me = [
    'instantiation/factoryAdapters/constructorWithDependencies',
    dep1.getMe(),
    dep2.getMe()
  ];
};

module.exports._constructor.prototype.getMe = function () {
  return this.me;
};
