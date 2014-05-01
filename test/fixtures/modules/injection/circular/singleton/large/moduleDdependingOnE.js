'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/singleton/large/moduleDDependingOnE',
  inject: 'injection/circular/singleton/large/moduleEDependingOnB'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
