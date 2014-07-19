'use strict';

// Fire me up!

module.exports = {
  implements: 'special/thisPointer'
};

module.exports.path = require('path').relative(process.cwd(), __filename);

module.exports.factory = function () {

  return this.path;

};
