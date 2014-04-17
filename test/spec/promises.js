'use strict';

describe('Regarding promises, FireUp', function () {

  var fireUpLib = require('../../lib/index.js');
  var Promise = require('bluebird');
  var path = require('path');


  it('should handle Bluebird promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/returnValue/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/returnValue/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/returnValue/bluebirdPromise(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'bluebirdPromise.js_1'));
        })
        .catch(function (e) {
          done(new Error('bluebirdPromise(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/returnValue/bluebirdPromise(1,2)');

        })
        .then(function (instance) {
          done(new Error('bluebirdPromise(1) should have thrown an error.'));
        })
        .catch(function (e) {
          expect(e.message).toEqual(path.join(folder, 'bluebirdPromise.js_2'));
        })
        .then(function () {

          return fireUp('instantiation/returnValue/bluebirdPromise(2,3)');

        })
        .then(function (instance) {
          done(new Error('bluebirdPromise(2) should have thrown an error.'));
        })
        .catch(function (e) {
          expect(e).toEqual(path.join(folder, 'bluebirdPromise.js_3'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

});
