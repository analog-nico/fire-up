'use strict';

describe('The require standard module', function () {

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
      modules: ['../fixtures/modules/injection/require/*.js']
    });

    fireUp('require(util)')
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.name).toEqual(fireUp.errors.ConfigError.name);
          done();
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        });

  });

  it('should throw an error when passing an invalid static arg', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js']
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

  it('should be able to require local files', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    fireUp('injection/require/requireLocalFile')
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'localFile.js'));
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should be able to require local files for a custom module', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [{
        implements: 'injection/require/requireLocalFile',
        inject: 'require(../fixtures/modules/injection/require/localFile.js)',
        factory: function (localFile) {
          return localFile;
        }
      }]
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    fireUp('injection/require/requireLocalFile')
      .then(function (instance) {
        expect(instance).toEqual(path.join(folder, 'localFile.js'));
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should be able to require local files with shortened path notation', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    BPromise.resolve()
      .then(function () {

        return fireUp('injection/require/requireLocalFileWithoutExt')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'localFile.js'));
          });

      })
      .then(function () {

        return fireUp('injection/require/requireIndexJsInFolder')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'index.js'));
          });

      })
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should throw an error if the required local file is not found', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js']
    });

    fireUp('injection/require/requireNonexistingLocalFile')
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          done();
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        });

  });

  it('should be able to require standard node modules', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    fireUp('injection/require/requireStandardNodeModule')
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'requireStandardNodeModule.js'));
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should be able to require installed node modules', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    fireUp('injection/require/requireLodash')
        .then(function (instance) {
          expect(instance).toBe(require('lodash'));
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should be able to require installed node modules', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js']
    });

    fireUp('injection/require/requireNonexistingModule')
        .then(function () {
          done(new Error('fireUp should have rejected the promise.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          done();
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        });

  });

  it('should use a require function passed through the options', function (done) {

    var options = {
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/require/*.js'],
      require: function (id) { return require(id); }
    };

    spyOn(options, 'require').andCallThrough();

    var fireUp = fireUpLib.newInjector(options);

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/require/'));

    fireUp('injection/require/requireStandardNodeModule')
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'requireStandardNodeModule.js'));
          expect(options.require).toHaveBeenCalled();
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

});
