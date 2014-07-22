'use strict';

// Fire me up!

module.exports = {
  implements: 'wrongConfig/thenableConstructor'
};

module.exports._constructor = function () {};
module.exports._constructor.then = function () {};
