'use strict';

var _ = require('lodash');


function validateModuleReference(moduleReference) {
  if (_.isUndefined(moduleReference) || _.isString(moduleReference) === false) {
    return false;
  }
  return moduleReference.match(/^([^:\(\)\s])+(:([^:\(\)\s])+)*(\(([^:\(\),])+(,([^:\(\),])+)*\))?$/m) === null ? false : true;
}

function parseModuleReference(moduleReference) {

  var segments = moduleReference.split(':');
  var args = [];

  if (segments[segments.length-1].match(/^([^:\(\)])+\(([^:\(\),])+(,([^:\(\),])+)*\)$/m) !== null) {
    var parts = segments[segments.length-1].split("(");
    segments[segments.length-1] = parts[0];
    parts[1] = parts[1].substr(0, parts[1].length-1);
    var rawArgs = parts[1].split(',');
    for ( var i = 0; i < rawArgs.length; i+=1 ) {
      var rawArg = rawArgs[i].trim();
      if (rawArg.match(/^(".*"|'.*')$/m) !== null) {
        args.push(rawArg.substr(1, rawArg.length-2));
      } else if (rawArg === 'true') {
        args.push(true);
      } else if (rawArg === 'false') {
        args.push(false);
      } else if (_.isNaN(Number(rawArg)) === false) {
        args.push(Number(rawArg));
      } else {
        args.push(rawArg);
      }
    }
  }

  return {
    segments: segments,
    args: args
  };
}

function validateInterfaceName(interfaceName) {
  if (_.isUndefined(interfaceName) || _.isString(interfaceName) === false) {
    return false;
  }
  return interfaceName.match(/^([^:\(\)\s])+(:([^:\(\)\s])+)*$/m) === null ? false : true;
}

function parseInterfaceName(interfaceName) {
  return parseModuleReference(interfaceName).segments;
}


module.exports = {
  validateModuleReference: validateModuleReference,
  parseModuleReference: parseModuleReference,
  validateInterfaceName: validateInterfaceName,
  parseInterfaceName: parseInterfaceName
};
