'use strict';

// Fire me up!

module.exports = function () {
  return require('path').relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: 'injection/circular/small/moduleBDependingOnA',
  inject: 'injection/circular/small/moduleADependingOnB'
};