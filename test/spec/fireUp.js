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
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  xit('should load modules with cascading dependencies');

  xit('should initialize singletons just once'); // TODO: Load one singleton by one of its implementing interfaces and again by another of its implementing interfaces.

  xit('should load multiple instances and not share them');

  xit('should load modules with static arguments');

  xit('should throw an error on circular dependencies');

});