'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/circular/singleton/large/moduleCDependingOnD',
  inject: 'injection/circular/singleton/large/moduleDDependingOnE'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
