'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectSubInterface',
  inject: 'interfaces/nested/baseInterface1:subInterface1'
};

module.exports.factory = function (subInterface) {
  return subInterface;
};
