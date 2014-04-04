'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/subInterface2.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/baseInterface1:subInterface2']
};
