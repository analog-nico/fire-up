'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/useConflict/baseInterface:extendedInterface:extended2'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
