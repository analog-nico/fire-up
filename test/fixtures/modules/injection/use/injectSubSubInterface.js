'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectSubSubInterface',
  inject: 'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
};

module.exports.factory = function (subSubInterface) {
  return subSubInterface;
};
