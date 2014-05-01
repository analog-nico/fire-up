'use strict';

// Fire me up!

module.exports = {
  implements: 'instantiation/failing/misspelledFireUpDependency',
  inject: 'fireUp/misspelled'
};

module.exports.factory = function (unknown) {
  return require('path').relative(process.cwd(), __filename);
};
