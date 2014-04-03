'use strict';

// Fire me up!

module.exports = function () {
  return 'descriptor/implements/subclassOfSingle.js';
};

module.exports.__module = {
  implements: 'descriptor/implements/single:sub'
};
