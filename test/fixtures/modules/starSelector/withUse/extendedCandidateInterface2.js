'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/basic:candidateInterface2:extended'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
