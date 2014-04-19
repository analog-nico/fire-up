'use strict';

// Fire me up!

module.exports = function (simpleValue, simpleValueAsync, object, objectAsync, functionSync, functionAsync) {
  return [simpleValue, simpleValueAsync, object, objectAsync, functionSync, functionAsync];
};

module.exports.__module = {
  implements: 'instantiation/returnValue/loadAll',
  inject: [
    'instantiation/returnValue/simpleValue',
    'instantiation/returnValue/simpleValueAsync',
    'instantiation/returnValue/object',
    'instantiation/returnValue/objectAsync',
    'instantiation/returnValue/function',
    'instantiation/returnValue/functionAsync'
  ]
};
