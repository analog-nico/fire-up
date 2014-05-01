'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/ambiguous/multipleSubInterfaces',
  inject: 'interfaces/nested/noBaseInterface1'
};

module.exports.factory = function (noBaseInterface2) {
  return [noBaseInterface2];
};
