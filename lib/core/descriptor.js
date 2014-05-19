'use strict';

var _ = require('lodash');


function validateModuleReference(moduleReference) {
  if (_.isUndefined(moduleReference) || _.isString(moduleReference) === false) {
    return false;
  }
  return moduleReference.match(/^([^:\(\)\s\*])+(:([^:\(\)\s\*])+)*(\(([^:\(\),])+(,([^:\(\),])+)*\)|:\*)?$/m) === null ? false : true;
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

function formatModuleReference(parsedModuleReference) {
  var formattedModuleReference = parsedModuleReference.segments.join(':');
  if (parsedModuleReference.args.length > 0) {
    formattedModuleReference += '(';
    for ( var i = 0; i < parsedModuleReference.args.length; i+=1 ) {
      if (i > 0) {
        formattedModuleReference += ', ';
      }
      if (_.isString(parsedModuleReference.args[i])) {
        formattedModuleReference += "'" + parsedModuleReference.args[i] + "'";
      } else {
        formattedModuleReference += String(parsedModuleReference.args[i]);
      }
    }
    formattedModuleReference += ')';
  }
  return formattedModuleReference;
}

function validateInterfaceName(interfaceName) {
  if (_.isUndefined(interfaceName) || _.isString(interfaceName) === false) {
    return false;
  }
  return interfaceName.match(/^([^:\(\)\s\*])+(:([^:\(\)\s\*])+)*$/m) === null ? false : true;
}

function parseInterfaceName(interfaceName) {
  return parseModuleReference(interfaceName).segments;
}

function formatInterfaceName(parsedInterfaceName) {
  return formatModuleReference({ segments: parsedInterfaceName, args: [] });
}

function convertModuleReferenceToInterfaceName(moduleReference) {
  return formatInterfaceName(parseModuleReference(moduleReference).segments);
}

function usesStarSelector(moduleReferenceOrInterfaceName) {
  var parsedModuleReference = parseModuleReference(moduleReferenceOrInterfaceName);
  return _.last(parsedModuleReference.segments) === '*';
}


module.exports = {
  validateModuleReference: validateModuleReference,
  parseModuleReference: parseModuleReference,
  formatModuleReference: formatModuleReference,
  validateInterfaceName: validateInterfaceName,
  parseInterfaceName: parseInterfaceName,
  formatInterfaceName: formatInterfaceName,
  convertModuleReferenceToInterfaceName: convertModuleReferenceToInterfaceName,
  usesStarSelector: usesStarSelector
};
