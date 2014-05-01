'use strict';

// Fire me up!

module.exports = {
  implements: ['wrongConfig/implementsWithStaticArgsAsArray', 'wrongConfig/implementsWithStaticArgsAsArray(not allowed)']
};

module.exports.factory = function () { };
