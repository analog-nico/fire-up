'use strict';

// Fire me up!

module.exports = function () {
  return 'wrongConfig/implementsNotAString.js';
};

module.exports.__module = {
  implements: 42
};
