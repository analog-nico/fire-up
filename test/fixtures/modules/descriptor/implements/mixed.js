'use strict';

// Fire me up!

module.exports = function () {
  return 'descriptor/implements/mixed.js';
};

module.exports.__module = {
  implements: ['descriptor/implements/multiple:sub', 'descriptor/implements/mixed']
};
