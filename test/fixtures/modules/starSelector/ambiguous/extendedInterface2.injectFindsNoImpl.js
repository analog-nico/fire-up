'use strict';

// Fire me up!

module.exports = {
  implements: 'starSelector/ambiguous/baseInterface:extendedInterface2:injectFindsNoImpl',
  inject: 'unknown'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
