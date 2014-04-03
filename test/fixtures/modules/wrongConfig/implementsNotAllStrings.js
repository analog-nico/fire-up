'use strict';

// Fire me up!

module.exports = function () {
  return 'wrongConfig/implementsNotAllStrings.js';
};

module.exports.__module = {
  implements: [ 'wrongConfig/implementsNotAllStrings', 42 ]
};
