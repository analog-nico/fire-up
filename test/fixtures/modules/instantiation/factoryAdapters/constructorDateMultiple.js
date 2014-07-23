'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/factoryAdapters/constructorDateMultiple',
  type: 'multiple instances'
};

module.exports._constructor = Date;
