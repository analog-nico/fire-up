'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/subSubInterfaceOfBaseInterface.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/baseInterface2:subInterface:subSubInterface']
};
