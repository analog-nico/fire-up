'use strict';

// Fire me up!

module.exports = function () { };

module.exports.__module = {
  implements: ['wrongConfig/injectOwnInterface-notInjected', 'wrongConfig/injectOwnInterface2', 'wrongConfig/injectOwnInterface2b:sub'],
  inject: ['wrongConfig/injectOwnInterface2b:sub', 'wrongConfig/injectOwnInterface2', 'somethingElse']
};
