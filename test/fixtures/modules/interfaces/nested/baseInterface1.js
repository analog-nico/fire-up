'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/baseInterface1.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/baseInterface1']
};
