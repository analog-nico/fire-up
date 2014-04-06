'use strict';

describe('Regarding its robustness, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');

  it('should throw an InstanceInitializationError when creating a module instance fails', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/failing/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/failing/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/failing/throwError');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.thrownError.message).toEqual(path.join(folder, 'throwError.js'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        });

  });

});