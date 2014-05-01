'use strict';

// Fire me up!

module.exports = {
  implements: ['injection/circular/singleton/large/moduleBDependingOnC', 'injection/circular/singleton/large/moduleBDependingOnC/secondInterface'],
  inject: 'injection/circular/singleton/large/moduleCDependingOnD'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
