'use strict';

describe('Regarding injection, FireUp', function () {

  var fireUpLib = require('../../lib/index.js');

  it('should load modules with direct (not cascading) dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '../fixtures/modules/injection/direct/*.js']
    });

    done();

  });

});