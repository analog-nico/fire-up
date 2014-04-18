'use strict';

// Fire me up!

module.exports = function (unknown) {
  return require('path').relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: 'instantiation/failing/misspelledFireUpDependency',
  inject: 'fireUp/misspelled'
};
