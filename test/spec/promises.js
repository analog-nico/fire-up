'use strict';

describe('Regarding promises, FireUp', function () {

  var fireUpLib = require('../../lib/index.js');
  var Promise = require('bluebird');
  var path = require('path');


  it('should handle Bluebird promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/bluebird(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'bluebird.js_1'));
        })
        .catch(function (e) {
          done(new Error('bluebird(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/bluebird(1,2)');

        })
        .then(function (instance) {
          done(new Error('bluebird(1) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'bluebird.js_2'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/promises/bluebird(2,3)');

        })
        .then(function (instance) {
          done(new Error('bluebird(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'bluebird.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle deferred promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/deferred(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'deferred.js_1'));
        })
        .catch(function (e) {
          done(new Error('deferred(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/deferred(2,3)');

        })
        .then(function (instance) {
          done(new Error('deferred(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'deferred.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle deferreds promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/deferreds(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'deferreds.js_1'));
        })
        .catch(function (e) {
          done(new Error('deferreds(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/deferreds(2,3)');

        })
        .then(function (instance) {
          done(new Error('deferreds(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'deferreds.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle kew promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/kew(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'kew.js_1'));
        })
        .catch(function (e) {
          done(new Error('kew(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/kew(2,3)');

        })
        .then(function (instance) {
          done(new Error('kew(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'kew.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle promise promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/promise(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'promise.js_1'));
        })
        .catch(function (e) {
          done(new Error('promise(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/promise(1,2)');

        })
        .then(function (instance) {
          done(new Error('promise(1) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'promise.js_2'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/promises/promise(2,3)');

        })
        .then(function (instance) {
          done(new Error('promise(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'promise.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle Q promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/q(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'q.js_1'));
        })
        .catch(function (e) {
          done(new Error('q(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/q(1,2)');

        })
        .then(function (instance) {
          done(new Error('q(1) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'q.js_2'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/promises/q(2,3)');

        })
        .then(function (instance) {
          done(new Error('q(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'q.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle RSVP promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/rsvp(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'rsvp.js_1'));
        })
        .catch(function (e) {
          done(new Error('rsvp(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/rsvp(1,2)');

        })
        .then(function (instance) {
          done(new Error('rsvp(1) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'rsvp.js_2'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/promises/rsvp(2,3)');

        })
        .then(function (instance) {
          done(new Error('rsvp(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'rsvp.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should handle when promises', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/promises/*.js'],
      require: require
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/promises/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/promises/when(0,1)');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folder, 'when.js_1'));
        })
        .catch(function (e) {
          done(new Error('when(1) should not have thrown an error.'));
        })
        .then(function () {

          return fireUp('instantiation/promises/when(1,2)');

        })
        .then(function (instance) {
          done(new Error('when(1) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause.message).toEqual(path.join(folder, 'when.js_2'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {

          return fireUp('instantiation/promises/when(2,3)');

        })
        .then(function (instance) {
          done(new Error('when(2) should have thrown an error.'));
        })
        .catch(fireUp.errors.InstanceInitializationError, function (e) {
          expect(e.cause).toEqual(path.join(folder, 'when.js_3'));
        })
        .catch(function (e) {
          done(new Error('fireUp rejected the promise with an error of type ' + e.name + ' (' + e.message + ')'));
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

});
