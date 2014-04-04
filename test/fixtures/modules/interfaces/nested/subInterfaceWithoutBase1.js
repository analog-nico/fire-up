'use strict';

// Fire me up!

module.exports = function () {
  return require('path').relative(process.cwd(), __dirname);
};

module.exports.__module = {
  implements: ['interfaces/nested/noBaseInterface1:subInterface1']
};
