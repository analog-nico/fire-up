'use strict';

// Fire me up!

module.exports = function () {
  return function () {
    require('path').relative(process.cwd(), __filename);
  };
};

module.exports.__module = {
  implements: 'instantiation/returnValue/function'
};
