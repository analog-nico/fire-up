'use strict';

// Fire me up!

module.exports = function (subInterface) {
  return subInterface;
};

module.exports.__module = {
  implements: 'injection/use/injectSubInterface',
  inject: 'interfaces/nested/baseInterface1:subInterface1'
};
