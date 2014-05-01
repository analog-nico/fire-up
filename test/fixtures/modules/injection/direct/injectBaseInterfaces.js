'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/direct/injectBaseInterfaces',
  inject: [
    'interfaces/unnested/singleAsList',
    'interfaces/unnested/multiple1',
    'interfaces/nested/baseAndSubInterface1',
    'interfaces/nested/baseAndSubInterface3',
    'interfaces/nested/baseInterface1',
    'interfaces/nested/baseInterface2',
    'interfaces/nested/noBaseInterface2'
  ]
};

module.exports.factory = function (singleAsList, multiple1, baseAndSubInterface1, baseAndSubInterface3, baseInterface1, baseInterface2, noBaseInterface2) {
  return [singleAsList, multiple1, baseAndSubInterface1, baseAndSubInterface3, baseInterface1, baseInterface2, noBaseInterface2];
};
