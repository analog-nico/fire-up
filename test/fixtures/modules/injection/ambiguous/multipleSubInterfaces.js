'use strict';

// Fire me up!

module.exports = function (noBaseInterface2) {
  return [noBaseInterface2];
};

module.exports.__module = {
  implements: 'injection/ambiguous/multipleSubInterfaces',
  inject: 'interfaces/nested/noBaseInterface1'
};
