'use strict';

// Fire me up!

module.exports = {
  implements: ['interfaces/unnested/multiple1', 'interfaces/unnested/multiple2']
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
