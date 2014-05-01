'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectBaseInterface1:wrapper',
  inject: 'injection/use/injectBaseInterface1'
};

module.exports.factory = function (baseInterface1) {
  return [baseInterface1, require('path').relative(process.cwd(), __filename)];
};
