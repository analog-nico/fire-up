'use strict';

// Fire me up!

module.exports = function (subSubInterface) {
  return subSubInterface;
};

module.exports.__module = {
  implements: 'injection/use/injectSubSubInterface',
  inject: 'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
};
