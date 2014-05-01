'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/failing/missingDependency',
  inject: 'unknownInterface'
};

module.exports.factory = function (unknown) {
  return require('path').relative(process.cwd(), __filename);
};
