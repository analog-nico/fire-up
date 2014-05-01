'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/ambiguous/injectNonExistentSubInterface',
  inject: 'interfaces/unnested/singleAsString:sub'
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
