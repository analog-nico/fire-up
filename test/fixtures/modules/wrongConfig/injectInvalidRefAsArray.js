'use strict';

// Fire me up!

module.exports = {
  implements: 'wrongConfig',
  inject: ['correct', 'no spaces allowed']
};

module.exports.factory = function () { };
