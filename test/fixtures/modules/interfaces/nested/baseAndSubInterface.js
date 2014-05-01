'use strict';

// Fire me up!

module.exports = {
  implements: [
    'interfaces/nested/baseAndSubInterface1',
    'interfaces/nested/baseAndSubInterface1:subInterface',
    'interfaces/nested/baseAndSubInterface2:subInterface',
    'interfaces/nested/baseAndSubInterface2',
    'interfaces/nested/baseAndSubInterface3',
    'interfaces/nested/baseAndSubInterface3:subInterface:subInterface',
    'interfaces/nested/baseAndSubInterface4:subInterface:subInterface',
    'interfaces/nested/baseAndSubInterface4'
  ]
};

module.exports.factory = function () {
  return require('path').relative(process.cwd(), __filename);
};
