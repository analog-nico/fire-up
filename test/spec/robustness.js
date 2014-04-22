'use strict';

describe('Regarding its robustness, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');
  var matchers = require('../matchers.js');


  beforeEach(function () {
    this.addMatchers(matchers);
  });


  it('should reject with an ConfigError when passing an invalid module reference', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/failing/*.js']
    });

    fireUp('inv(al)id')
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.ConfigError, function (e) {
          done();
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        });

  });

  it('should reject with an ConfigError when passing invalid options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/failing/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('test', 'options of invalid type')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.ConfigError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('test', { basePath: 'not allowed' })
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.ConfigError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('test', { modules: 'not allowed' })
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.ConfigError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('test', { use: 'invalid type' })
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.ConfigError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        });

  });

  it('should reject with an NoImplementationError when no implementation is found', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/failing/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('unknownInterface');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.NoImplementationError, function (e) {
          // This is expected to be called.
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/failing/missingDependency');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.NoImplementationError, function (e) {
          // This is expected to be called.
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('fireUp/currentInjector');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.NoImplementationError, function (e) {
          // This is expected to be called.
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/failing/misspelledFireUpDependency');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.NoImplementationError, function (e) {
          // This is expected to be called.
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        });

  });

  it('should ignore a module for a parent interface when sub interface is requested', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/unnested/*.js', '../fixtures/modules/interfaces/nested/*.js', '../fixtures/modules/injection/ambiguous/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/unnested/singleAsString:sub')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/noBaseInterface1:subInterface1:sub1:sub2')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {

          return fireUp('injection/ambiguous/injectNonExistentSubInterface')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {
          done();
        });

  });

  it('should ignore conflicting implementations that would otherwise match the requested module reference', function (done) {

    // Use internal calls to force creating the injector with a registry containing conflicts.
    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/interfaces/conflicts/implementingSameInterface1.js',
        '../fixtures/modules/interfaces/conflicts/implementingSameSubInterface1.js'
      ]
    });
    expect(function () {
      fireUp._internal.registry.registerInterface('test/fixtures/modules/interfaces/conflicts/implementingSameInterface2.js', 'interfaces/conflicts/implementingSameInterface');
    }).toThrowOfType(fireUpLib.errors.InterfaceRegistrationConflictError);
    expect(function () {
      fireUp._internal.registry.registerInterface('test/fixtures/modules/interfaces/conflicts/implementingSameSubInterface2.js', 'interfaces/conflicts/implementingSameSubInterface:sub');
    }).toThrowOfType(fireUpLib.errors.InterfaceRegistrationConflictError);

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/conflicts/implementingSameInterface')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {

          return fireUp('interfaces/conflicts/implementingSameSubInterface')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {
          done();
        });

  });

  it('should not load a more specific implementation if it is ambiguous', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/unnested/*.js', '../fixtures/modules/interfaces/nested/*.js', '../fixtures/modules/injection/ambiguous/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/noBaseInterface1')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {

          return fireUp('injection/ambiguous/multipleSubInterfaces')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              })
              .catch(function (e) {
                done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
              });

        })
        .then(function () {
          done();
        });

  });

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
          expect(e.cause.message).toEqual(path.join(folder, 'throwError.js'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/failing/throwErrorAsync');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'throwErrorAsync.js'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/failing/injectThrowError');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'throwError.js'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/failing/injectThrowErrorAsync');

        })
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'throwErrorAsync.js'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        });

  });

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