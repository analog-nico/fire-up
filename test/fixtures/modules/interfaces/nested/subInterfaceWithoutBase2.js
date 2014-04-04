'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/subInterfaceWithoutBase2.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/noBaseInterface1:subInterface2']
};
