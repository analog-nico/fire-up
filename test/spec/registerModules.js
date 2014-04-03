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

    expect(_.isPlainObject(fireUp._internal.registry.files[path.join(__dirname, '../fixtures/modules/simple/simple.js')])).toBe(true);
    expect(_.isPlainObject(fireUp._internal.registry.files[path.join(__dirname, '../fixtures/modules/simple/notToFireUp.js')])).toBe(true);

    done();

  });

});
