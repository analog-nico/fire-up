'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/direct/injectSubInterfaces',
  inject: [
    'interfaces/nested/baseAndSubInterface1:subInterface',
    'interfaces/nested/baseAndSubInterface3:subInterface:subInterface',
    'interfaces/nested/baseAndSubInterface3:subInterface',
    'interfaces/nested/baseInterface1:subInterface1',
    'interfaces/nested/baseInterface1:subInterface2',
    'interfaces/nested/noBaseInterface1:subInterface1',
    'interfaces/nested/noBaseInterface2:subInterface:subInterface',
    'interfaces/nested/noBaseInterface2:subInterface'
  ]
};

module.exports.factory = function (baseAndSubInterface1_subInterface, baseAndSubInterface3_subInterface_subInterface, baseAndSubInterface3_subInterface, baseInterface1_subInterface1, baseInterface1_subInterface2, noBaseInterface1_subInterface1, noBaseInterface2_subInterface_subInterface, noBaseInterface2_subInterface) {
  return [baseAndSubInterface1_subInterface, baseAndSubInterface3_subInterface_subInterface, baseAndSubInterface3_subInterface, baseInterface1_subInterface1, baseInterface1_subInterface2, noBaseInterface1_subInterface1, noBaseInterface2_subInterface_subInterface, noBaseInterface2_subInterface];
};
