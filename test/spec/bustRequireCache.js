'use strict';

describe('Regarding the bustRequireCache option, FireUp', function () {

  var fireUpLib = require('../../lib/index.js');
  var _ = require('lodash');
  var BPromise = require('bluebird');
  var path = require('path');

  it('should leave the cache intact without the option', function (done) {

    var cacheKeysOne, cacheKeysTwo, cacheKeysThree;

    var absolutePathOfSingletonModule = path.join(__dirname, '../fixtures/modules/instantiation/type/singleton.js');

    BPromise.resolve()
      .then(function () {
        cacheKeysOne = _.without(_.keys(require.cache), absolutePathOfSingletonModule);
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
        instance[0] = instance[0].replace(/\\/g, '/');
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
        instance[0] = instance[0].replace(/\\/g, '/');
        expect(instance).toEqual(['test/fixtures/modules/instantiation/type/singleton.js', 2]);

        cacheKeysThree = _.keys(require.cache);
        expect(_.difference(cacheKeysTwo, cacheKeysThree)).toEqual([]);
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should bust the cache for a single module', function (done) {

    var cacheKeysOne, cacheKeysTwo, cacheKeysThree;

    var absolutePathOfSingletonModule = path.join(__dirname, '../fixtures/modules/instantiation/type/singleton.js');

    BPromise.resolve()
      .then(function () {
        cacheKeysOne = _.without(_.keys(require.cache), absolutePathOfSingletonModule);
        expect(_.contains(cacheKeysOne, path.join(__dirname, '../../lib/index.js'))).toBe(true);
      })
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/**/*.js'],
          bustRequireCache: true
        });

        return fireUp('instantiation/type/singleton/interface1');

      })
      .then(function (instance) {
        instance[0] = instance[0].replace(/\\/g, '/');
        expect(instance).toEqual(['test/fixtures/modules/instantiation/type/singleton.js', 1]);

        cacheKeysTwo = _.keys(require.cache);
        expect(_.difference(cacheKeysOne, _.without(cacheKeysTwo, absolutePathOfSingletonModule))).toEqual([]);
      })
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/**/*.js'],
          bustRequireCache: true
        });

        return fireUp('instantiation/type/singleton/interface1');

      })
      .then(function (instance) {
        instance[0] = instance[0].replace(/\\/g, '/');
        expect(instance).toEqual(['test/fixtures/modules/instantiation/type/singleton.js', 1]);

        cacheKeysThree = _.keys(require.cache);
        expect(_.difference(cacheKeysTwo, cacheKeysThree)).toEqual([]);
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should bust the cache for multiple modules', function(done) {

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    BPromise.resolve()
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/*.js'],
          bustRequireCache: true
        });

        return fireUp('instantiation/type/injectAllTypesMixed');

      })
      .then(function (instance) {
        expect(instance).toEqual([
          [path.join(folder, 'singletonAsync.js'), 1],
          [path.join(folder, 'singleton.js'), 1],
          [path.join(folder, 'singletonAsync.js'), 1],
          [path.join(folder, 'multiInstancesAsync.js'), 1],
          [path.join(folder, 'multiInstances.js'), 1],
          [path.join(folder, 'multiInstancesAsync.js'), 2]
        ]);
      })
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/*.js'],
          bustRequireCache: true
        });

        return fireUp('instantiation/type/injectAllTypesMixed');

      })
      .then(function (instance) {
        expect(instance).toEqual([
          [path.join(folder, 'singletonAsync.js'), 1],
          [path.join(folder, 'singleton.js'), 1],
          [path.join(folder, 'singletonAsync.js'), 1],
          [path.join(folder, 'multiInstancesAsync.js'), 1],
          [path.join(folder, 'multiInstances.js'), 1],
          [path.join(folder, 'multiInstancesAsync.js'), 2]
        ]);
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should not bust the cache for non-fireUp-modules', function (done) {

    BPromise.resolve()
      .then(function () {
        expect(_.contains(_.keys(require.cache), path.join(__dirname, '../../lib/index.js'))).toBe(true);
      })
      .then(function () {

        var fireUp = fireUpLib.newInjector({
          basePath: __dirname,
          modules: ['../fixtures/modules/instantiation/type/**/*.js'],
          bustRequireCache: true
        });

        return fireUp('instantiation/type/singleton/interface1');

      })
      .then(function (instance) {
        instance[0] = instance[0].replace(/\\/g, '/');
        expect(instance).toEqual(['test/fixtures/modules/instantiation/type/singleton.js', 1]);

        expect(_.contains(_.keys(require.cache), path.join(__dirname, '../../lib/index.js'))).toBe(true);
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  // TODO
  xit('should bust the cache for modules matching a star selector');

});
