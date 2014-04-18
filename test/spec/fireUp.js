'use strict';

describe('Regarding injection, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');

  it('should load modules with direct (not cascading) dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/direct/*.js']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/direct/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('injection/direct/noDependencies');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folderInjection, 'noDependencies.js'));
        })
        .then(function () {

          return fireUp('injection/direct/singleDependencyAsString');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folderInterfaces, 'unnested/singleAsString.js')]);
        })
        .then(function () {

          return fireUp('injection/direct/singleDependencyAsList');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folderInterfaces, 'unnested/singleAsList.js')]);
        })
        .then(function () {

          return fireUp('injection/direct/injectBaseInterfaces');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInterfaces, 'unnested/singleAsList.js'),
            path.join(folderInterfaces, 'unnested/multiple.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseInterface1.js'),
            path.join(folderInterfaces, 'nested/baseInterface2.js'),
            path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js')
          ]);
        })
        .then(function () {

          return fireUp('injection/direct/injectSubInterfaces');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/subInterface1.js'),
            path.join(folderInterfaces, 'nested/subInterface2.js'),
            path.join(folderInterfaces, 'nested/subInterfaceWithoutBase1.js'),
            path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js'),
            path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js')
          ]);
        })
        .then(function () {

          return fireUp('injection/direct/takesStaticArgs(staticArg)');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInterfaces, 'unnested/singleAsList.js'),
            'staticArg'
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  xit('should load modules with cascading dependencies');

  it('should initialize modules according to their type', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/singleton/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singleton.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singleton/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singleton.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singleton/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singleton.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstances/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstances.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstances/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstances.js'), 2]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstances/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstances.js'), 3]);
        })
        .then(function () {

          return fireUp('instantiation/type/injectAllTypes');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'multiInstances.js'), 4],
            [path.join(folder, 'multiInstances.js'), 5],
            [path.join(folder, 'multiInstances.js'), 6]
          ]);
        })
        .then(function () {

          return fireUp('instantiation/type/singletonAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singletonAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singletonAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singletonAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singletonAsync/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singletonAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstancesAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstancesAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstancesAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstancesAsync.js'), 2]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstancesAsync/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstancesAsync.js'), 3]);
        })
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesAsync');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'multiInstancesAsync.js'), 4],
            [path.join(folder, 'multiInstancesAsync.js'), 5],
            [path.join(folder, 'multiInstancesAsync.js'), 6]
          ]);
        })
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesMixed');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'multiInstancesAsync.js'), 7],
            [path.join(folder, 'multiInstances.js'), 7],
            [path.join(folder, 'multiInstancesAsync.js'), 8]
          ]);
        })
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesMixedCascading');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'multiInstancesAsync.js'), 9],
            [path.join(folder, 'multiInstances.js'), 8],
            [
              [path.join(folder, 'singletonAsync.js'), 1],
              [path.join(folder, 'singleton.js'), 1],
              [path.join(folder, 'singletonAsync.js'), 1],
              [path.join(folder, 'multiInstancesAsync.js'), 10],
              [path.join(folder, 'multiInstances.js'), 9],
              [path.join(folder, 'multiInstancesAsync.js'), 11]
            ],
            [
              [path.join(folder, 'singleton.js'), 1],
              [path.join(folder, 'singleton.js'), 1],
              [path.join(folder, 'singleton.js'), 1],
              [path.join(folder, 'multiInstances.js'), 10],
              [path.join(folder, 'multiInstances.js'), 11],
              [path.join(folder, 'multiInstances.js'), 12]
            ],
            [
              [path.join(folder, 'singletonAsync.js'), 1],
              [path.join(folder, 'singletonAsync.js'), 1],
              [path.join(folder, 'singletonAsync.js'), 1],
              [path.join(folder, 'multiInstancesAsync.js'), 12],
              [path.join(folder, 'multiInstancesAsync.js'), 13],
              [path.join(folder, 'multiInstancesAsync.js'), 14]
            ],
            [path.join(folder, 'singletonAsync.js'), 1],
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'multiInstancesAsync.js'), 15],
            [path.join(folder, 'multiInstances.js'), 13]
          ]);
        })
        .then(function () {

          return fireUp('instantiation/type/injectAndFireUp');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'singleton.js'), 1],
            [path.join(folder, 'multiInstances.js'), 14],
            [path.join(folder, 'multiInstances.js'), 15]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  xit('should load modules with static arguments');

  it('should reject injections with static args for singletons', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/unnested/*.js', '../fixtures/modules/wrongConfig/staticArgsForSingleton.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('wrongConfig/staticArgsForSingleton');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.ConfigError, function (e) {
          // This is expected to be called.
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        });

  });

  it('should throw an error on circular dependencies with singletons', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/circular/small/*.js']
    });

    fireUp('injection/circular/small/moduleADependingOnB')
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.CircularDependencyError, function (e) {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  xit('should throw an error on circular dependencies with modules of type multiple instances');

});