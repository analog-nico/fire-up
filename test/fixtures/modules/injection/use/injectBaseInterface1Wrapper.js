'use strict';

// Fire me up!

module.exports = function (baseInterface1) {
  return [baseInterface1, require('path').relative(process.cwd(), __filename)];
};

module.exports.__module = {
  implements: 'injection/use/injectBaseInterface1:wrapper',
  inject: 'injection/use/injectBaseInterface1'
};
