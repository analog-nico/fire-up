'use strict';

// Fire me up!

module.exports = function () {
  return 'wrongConfig/implementsDefinedTwice2.js';
};

module.exports.__module = {
  implements: ['wrongConfig/implementsDefinedTwice']
};
