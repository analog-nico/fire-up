'use strict';

// Fire me up!

module.exports = function (singleAsList, multiple1, baseAndSubInterface1, baseAndSubInterface3, baseInterface1, baseInterface2, noBaseInterface1, noBaseInterface2) {
  return [singleAsList, multiple1, baseAndSubInterface1, baseAndSubInterface3, baseInterface1, baseInterface2, noBaseInterface1, noBaseInterface2];
};

module.exports.__module = {
  implements: 'injection/direct/injectBaseInterfaces',
  inject: [
    'interfaces/unnested/singleAsList',
    'interfaces/unnested/multiple1',
    'interfaces/nested/baseAndSubInterface1',
    'interfaces/nested/baseAndSubInterface3',
    'interfaces/nested/baseInterface1',
    'interfaces/nested/baseInterface2',
    'interfaces/nested/noBaseInterface1',
    'interfaces/nested/noBaseInterface2'
  ]
};
