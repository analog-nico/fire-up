'use strict';

// Fire me up!

module.exports = function () {
  return 'descriptor/implements/parentAndSubclass.js';
};

module.exports.__module = {
  implements: ['descriptor/implements', 'descriptor/implements/multiple2:sub']
};
