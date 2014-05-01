'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/small/moduleBDependingOnA',
  inject: 'injection/circular/small/moduleADependingOnB'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
