'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/subInterfaceWithoutBase1.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/noBaseInterface1:subInterface1']
};
