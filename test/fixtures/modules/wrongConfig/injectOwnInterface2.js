'use strict';

// Fire me up!

module.exports = {
  implements: ['wrongConfig/injectOwnInterface-notInjected', 'wrongConfig/injectOwnInterface2', 'wrongConfig/injectOwnInterface2b:sub'],
  inject: ['wrongConfig/injectOwnInterface2b:sub', 'wrongConfig/injectOwnInterface2', 'somethingElse']
};

module.exports.factory = function () { };
