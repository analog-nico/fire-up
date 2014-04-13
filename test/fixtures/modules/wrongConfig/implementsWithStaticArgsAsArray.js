'use strict';

// Fire me up!

module.exports = function () { };

module.exports.__module = {
  implements: ['wrongConfig/implementsWithStaticArgsAsArray', 'wrongConfig/implementsWithStaticArgsAsArray(not allowed)']
};
