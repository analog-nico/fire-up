'use strict';

describe('Regarding module registration, FireUp', function () {

  var _ = require('lodash');
  var path = require('path');

  var fireUpLib = require('../../lib/index.js');

  it('should register a module with // Fire me up!', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/simple/**/*.js']
    });

    var filePathToLoad = path.join(__dirname, '../fixtures/modules/simple/simple.js');
    var filePathToIgnore = path.join(__dirname, '../fixtures/modules/simple/notToFireUp.js');

    expect(_.isPlainObject(fireUp._internal.registry.modules[filePathToLoad])).toBe(true);
    expect(_.isPlainObject(fireUp._internal.registry.modules[filePathToIgnore])).toBe(true);

    expect(fireUp._internal.registry.modules[filePathToLoad].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[filePathToIgnore].status).toBe(fireUp.constants.FILE_STATUS_TO_IGNORE);

    expect(_.isFunction(fireUp._internal.registry.modules[filePathToLoad].cache.module)).toBe(true);

    done();

  });

});
