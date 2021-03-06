'use strict';

describe('The require mock standard module', function () {

  var fireUpLib = require('../../lib/index.js');
  var BPromise = require('bluebird');
  var path = require('path');
  var matchers = require('../matchers.js');


  beforeEach(function () {
    this.addMatchers(matchers);
  });


  it('should throw an error when using require directly in the fireUp call', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/**/*.js'],
      bustRequireCache: true,
      use: ['require:mock'],
      myCustomOption: 'Hello world!'
    });

    BPromise.resolve()
      .then(function () {

        return fireUp('require(./local.js)', { requireMockMapping: {} })
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
            expect(e.cause.message).toEqual("Calling fireUp('require(...)') for relative paths is not supported. 'require(...)' with a relative path is only available through injection.");
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {

        return fireUp('require(util)', { requireMockMapping: { 'util': 'require(./local.js)' } })
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
            expect(e.cause.message).toEqual("The id 'util' in the requireMockMapping maps to a require injection with a relative path which is not supported: require(./local.js)");
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should throw an error when passing an invalid static arg', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/**/*.js'],
      use: ['require:mock']
    });

    BPromise.resolve()
      .then(function () {

        return fireUp('injection/require/noStaticArg');

      })
      .then(function () {
        done(new Error('fireUp should have rejected the promise.'));
      })
      .catch(fireUp.errors.InstanceInitializationError, function (e) {
        // This is expected to be called.
        expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
      })
      .catch(function (e) {
        done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
      })
      .then(function () {

        return fireUp('injection/require/emptyStringAsStaticArg');

      })
      .then(function () {
        done(new Error('fireUp should have rejected the promise.'));
      })
      .catch(fireUp.errors.InstanceInitializationError, function (e) {
        // This is expected to be called.
        expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
      })
      .catch(function (e) {
        done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
      })
      .then(function () {

        return fireUp('injection/require/noStringAsStaticArg');

      })
      .then(function () {
        done(new Error('fireUp should have rejected the promise.'));
      })
      .catch(fireUp.errors.InstanceInitializationError, function (e) {
        // This is expected to be called.
        expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
      })
      .catch(function (e) {
        done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
      })
      .then(function () {
        done();
      });

  });

  it('should validate the options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/**/*.js'],
      use: ['require:mock']
    });

    BPromise.resolve()
      .then(function () {

        return fireUp('injection/require/requireLodash')
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {

        return fireUp('injection/require/requireLodash', { requireMockMapping: "wrong type" })
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should validate the mappings in the requireMockMapping', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/**/*.js'],
      require: require,
      use: ['require:mock']
    });

    BPromise.resolve()
      .then(function () {

        return fireUp('injection/require/requireLodash', {
          requireMockMapping: {
            'lodash': 42
          }
        })
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {

        return fireUp('injection/require/requireLodash', {
          requireMockMapping: {
            'lodash': 'in(va)lid'
          }
        })
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {

        return fireUp('injection/require/requireLodash', {
          requireMockMapping: {
            'lodash': 'star:selector:*'
          }
        })
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should fall back to a regular require injection if no mapping exists', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/**/*.js'],
      use: ['require:mock'],
      require: require,
      requireMockMapping: {}
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    BPromise.resolve()
      .then(function () {

        return fireUp('injection/require/requireLodash')
          .then(function (instance) {
            expect(instance).toBe(require('lodash'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireLocalFile')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'localFile.js'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireNonexistingModule')
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            // This is expected to be called.
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  // TODO: Options should merge requireMockMapping passed through 'newInjector' and 'fireUp'

  it('should inject mapped Fire Up! modules', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/injection/require/**/*.js',
        '../fixtures/modules/interfaces/unnested/**/*.js'
      ],
      use: ['require:mock'],
      require: require,
      requireMockMapping: {
        'whatever': 'interfaces/unnested/singleAsList',
        'lodash': 'interfaces/unnested/multiple1',
        'unknown': 'interfaces/unknown',
        'notinstalled': 'interfaces/unknown2'
      }
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/unnested/'));

    BPromise.resolve()
      .then(function () {

        return fireUp('require(whatever)')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'singleAsList.js'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireLodash')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'multiple.js'));
          });

      })
      .then(function () {

        return fireUp('require(unknown)')
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            // This is expected to be called.
            expect(e.cause.name).toEqual(fireUp.errors.NoImplementationError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {

        return fireUp('injection/require/requireNonexistingModule')
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            // This is expected to be called.
            expect(e.cause.name).toEqual(fireUp.errors.NoImplementationError.name);
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should inject mapped Fire Up! modules with respecting the use option', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/injection/require/**/*.js',
        '../fixtures/modules/interfaces/nested/**/*.js'
      ],
      use: [
        'require:mock',
        'interfaces/nested/baseInterface1:subInterface1',
        'interfaces/nested/baseInterface2:subInterface:subSubInterface'
      ],
      require: require,
      requireMockMapping: {
        'whatever': 'interfaces/nested/baseInterface1',
        'lodash': 'interfaces/nested/baseInterface2'
      }
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/nested/'));

    BPromise.resolve()
      .then(function () {

        return fireUp('require(whatever)')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'subInterface1.js'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireLodash')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'subSubInterfaceOfBaseInterface.js'));
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should inject mapped node.js modules', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/**/*.js'],
      use: ['require:mock'],
      require: require,
      requireMockMapping: {
        'lodash': 'require(simple-glob)',
        'path': 'require(util)',
        'notinstalled': 'require(http)',
        'bluebird': 'require(doesntexist)'
      }
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    BPromise.resolve()
      .then(function () {

        return fireUp('injection/require/requireLodash')
          .then(function (instance) {
            expect(instance).toBe(require('simple-glob'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireStandardNodeModule')
          .then(function (instance) {
            expect(instance).toBe(require('util'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireNonexistingModule')
          .then(function (instance) {
            expect(instance).toBe(require('http'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireBluebird')
          .then(function () {
            throw new Error('fireUp should have rejected the promise.');
          })
          .catch(fireUp.errors.InstanceInitializationError, function (e) {
            // This is expected to be called.
          })
          .catch(function (e) {
            throw new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')');
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  xit('should detect injection circles introduced through mocking');

});
