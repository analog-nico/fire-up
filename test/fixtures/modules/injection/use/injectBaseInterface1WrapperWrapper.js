'use strict';

// Fire me up!

module.exports = {
  implements: 'injection/use/injectBaseInterface1:wrapper:wrapper',
  inject: 'injection/use/injectBaseInterface1:wrapper'
};

module.exports.factory = function (injectBaseInterface1Wrapper) {
  return [injectBaseInterface1Wrapper, require('path').relative(process.cwd(), __filename)];
};
