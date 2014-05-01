'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/small/moduleADependingOnB',
  inject: 'injection/circular/small/moduleBDependingOnA'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
