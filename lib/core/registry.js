'use strict';

var _ = require('lodash');

var descriptor = require('./descriptor.js');


function newRegistry(fireUp) {

  var registry = {

    basePathForFileRefs: process.cwd(),
    modules: {},
    interfaces: {}

  };

  registry.findInterface = function (moduleReference) {

    var segments = descriptor.parseModuleReference(moduleReference).segments;
    var registryPointer = registry.interfaces;

    var currentInterface = "";
    var parentInterface = "";
    var lastImplementedInterface = "";

    for ( var i = 0; i < segments.length; i+=1 ) {

      if (i > 0) {
        currentInterface += ':';
      }
      currentInterface += segments[i];

      if (_.isUndefined(registryPointer[segments[i]])) {
        fireUp.log.warning('No implementation found for module reference: ' + moduleReference);
        if (lastImplementedInterface === "") {
          fireUp.log.debug('FYI there is an implementation for the more general interface: ' + lastImplementedInterface);
        } else {
          fireUp.log.debug('Also no implementation for a more general interface found.');
        }
        return;
      }

      if (i === segments.length-1) {

        if (_.isString(registryPointer[segments[i]].file)) {
          return registryPointer[segments[i]];
        } else if (_.isArray(registryPointer[segments[i]].conflictingFiles)) {
          fireUp.log.warning('No implementation available due to conflicting implementations for the interface: ' + currentInterface);
          return;
        }

        // Get a more specific implementation if unambiguous
        var parentSegment;
        var currentSegment = segments[i];
        var interfaces;
        while ((interfaces = _.keys(registryPointer[currentSegment].interfaces)).length === 1) {

          registryPointer = registryPointer[currentSegment].interfaces;
          parentSegment = currentSegment;
          currentSegment = interfaces[0];
          parentInterface = currentInterface;
          currentInterface += ':' + currentSegment;

          if (_.isString(registryPointer[currentSegment].file)) {
            return registryPointer[currentSegment];
          } else if (_.isArray(registryPointer[currentSegment].conflictingFiles)) {
            fireUp.log.warning('No implementation available due to conflicting implementations for the interface: ' + currentInterface);
            return;
          }

        }

        fireUp.log.warning('No exact or more specific, unambiguous implementation found for module reference: ' + moduleReference);
        if (interfaces.length > 1) {
          fireUp.log.debug('There are multiple implementations for more specific interfaces. However, the ambiguity prohibits loading a more specific implementation.');
        }
        return;

      }

      parentInterface = currentInterface;
      if (_.isString(registryPointer[segments[i]].file)) {
        lastImplementedInterface = parentInterface;
      }
      registryPointer = registryPointer[segments[i]].interfaces;

    }

  };

  return registry;

}


module.exports = {
  new: newRegistry
};
