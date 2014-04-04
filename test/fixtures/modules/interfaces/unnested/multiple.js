'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/unnested/multiple.js';
};

module.exports.__module = {
  implements: ['interfaces/unnested/multiple1', 'interfaces/unnested/multiple2']
};
