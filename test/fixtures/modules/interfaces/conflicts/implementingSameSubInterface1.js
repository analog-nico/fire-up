'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/conflicts/implementingSameSubInterface:sub']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
