'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/subSubInterfaceWithoutBase.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/noBaseInterface2:subInterface:subInterface']
};
