'use strict';

describe('Regarding injection, FireUp', function () {

  var path = require('path');
  var fireUpLib = require('../../lib/index.js');

  it('should load modules with direct (not cascading) dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '../fixtures/modules/injection/direct/*.js']
    });

    var moduleFolder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/direct/'));
    var pathNoDependenciesJs = path.join(moduleFolder, 'noDependencies.js');

    fireUp('injection/direct/noDependencies')
        .then(function (instance) {
          expect(instance).toEqual(pathNoDependenciesJs);
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

});