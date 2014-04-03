'use strict';

// Fire me up!

module.exports = function () {
  return 'descriptor/implements/multiple.js';
};

module.exports.__module = {
  implements: ['descriptor/implements/multiple', 'descriptor/implements/multiple2']
};
