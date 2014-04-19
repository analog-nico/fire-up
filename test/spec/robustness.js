'use strict';

describe('Regarding its robustness, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');
  var matchers = require('../matchers.js');


  beforeEach(function () {
    this.addMatchers(matchers);
  });


  it('should reject with an NoImplementationError when no implementation error is found', function (done) {

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