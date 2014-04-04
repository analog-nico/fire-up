'use strict';

// Fire me up!

module.exports = function () {
  return 'interfaces/nested/subSubInterfaceOfSubInterface.js';
};

module.exports.__module = {
  implements: ['interfaces/nested/baseInterface1:subInterface1:subSubInterface']
};
