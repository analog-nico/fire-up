'use strict';

// Fire me up!

module.exports = {
  implements: 'interfaces/unnested/singleAsString'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
