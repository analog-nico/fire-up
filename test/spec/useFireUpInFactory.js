'use strict';

describe('Regarding its nested use, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');

  it('should allow fireUp(...) calls in the factory method', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/useFireUpInFactory/**/*.js',
        '../fixtures/modules/simple/**/*.js'
      ]
    });

    var folderSimple = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/simple/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/useFireUpInFactory/simple')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderSimple, 'simple.js'));
              });

        })
        .then(function () {

          return fireUp('instantiation/useFireUpInFactory/simple', { use: ['fireUp/currentInjector:newInsteadOfCurrent'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderSimple, 'simple.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

});
