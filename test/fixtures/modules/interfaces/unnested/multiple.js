'use strict';

// Fire me up!

module.exports = function () {
  return require('path').relative(process.cwd(), __filename);
};

module.exports.__module = {
  implements: ['interfaces/unnested/multiple1', 'interfaces/unnested/multiple2']
};
