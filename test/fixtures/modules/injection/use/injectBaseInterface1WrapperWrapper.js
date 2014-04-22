'use strict';

// Fire me up!

module.exports = function (injectBaseInterface1Wrapper) {
  return [injectBaseInterface1Wrapper, require('path').relative(process.cwd(), __filename)];
};

module.exports.__module = {
  implements: 'injection/use/injectBaseInterface1:wrapper:wrapper',
  inject: 'injection/use/injectBaseInterface1:wrapper'
};
