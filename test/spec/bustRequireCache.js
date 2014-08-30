'use strict';

describe('Regarding the bustRequireCache option, FireUp', function () {

  var fireUpLib = require('../../lib/index.js');
  var _ = require('lodash');
  var Promise = require('bluebird');
  var path = require('path');

  it('should leave the cache intact without the option', function (done) {

    var cacheKeysOne, cacheKeysTwo, cacheKeysThree;

    var absolutePathOfSingletonModule = path.join(__dirname, '../fixtures/modules/instantiation/type/singleton.js');

    Promise.resolve()
      .then(function () {
        cacheKeysOne = _.keys(require.cache);
        expect(_.contains(cacheKeysOne, path.join(__dirname, '../../lib/index.js'))).toBe(true);
      })
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/**/*.js']
        });

        return fireUp('instantiation/type/singleton/interface1');

      })
      .then(function (instance) {
        expect(instance).toEqual(['test/fixtures/modules/instantiation/type/singleton.js', 1]);

        cacheKeysTwo = _.keys(require.cache);
        expect(_.difference(cacheKeysOne, _.without(cacheKeysTwo, absolutePathOfSingletonModule))).toEqual([]);
      })
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/**/*.js']
        });

        return fireUp('instantiation/type/singleton/interface1');

      })
      .then(function (instance) {
        expect(instance).toEqual(['test/fixtures/modules/instantiation/type/singleton.js', 2]);

        cacheKeysThree = _.keys(require.cache);
        expect(_.difference(cacheKeysTwo, cacheKeysThree)).toEqual([]);
      })
      .then(done);

  });

  xit('should bust the cache for a single module');

  xit('should bust the cache for multiple modules');

  xit('should not bust the cache for non-fireUp-modules');

});
