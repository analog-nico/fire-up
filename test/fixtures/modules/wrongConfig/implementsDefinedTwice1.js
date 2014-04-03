'use strict';

// Fire me up!

module.exports = function () {
  return 'wrongConfig/implementsDefinedTwice1.js';
};

module.exports.__module = {
  implements: ['wrongConfig/implementsDefinedTwice']
};
