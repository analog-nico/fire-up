'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/singleton/large/moduleEDependingOnB',
  inject: 'injection/circular/singleton/large/moduleBDependingOnC'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
