'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/singleton/large/moduleADependingOnBWithSecondInterface',
  inject: 'injection/circular/singleton/large/moduleBDependingOnC/secondInterface'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
