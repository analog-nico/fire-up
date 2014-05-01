'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/unnested/singleAsList']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
