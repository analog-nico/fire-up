'use strict';

describe('Regarding the star selector, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');
  var matchers = require('../matchers.js');


  beforeEach(function () {
    this.addMatchers(matchers);
  });


  it('should load all extending interfaces', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/starSelector/basic/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/starSelector/basic/'));

    Promise.resolve()
        .then(function () {

          return fireUp('starSelector/basic:*')
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/basic:candidateInterface1': path.join(folder, 'candidateInterface1.js'),
                  'starSelector/basic:candidateInterface2': path.join(folder, 'candidateInterface2.js'),
                  'starSelector/basic:candidateInterface:extended': path.join(folder, 'extendedCandidateInterface.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/basic/injectWithStarSelector')
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/basic:candidateInterface1': path.join(folder, 'candidateInterface1.js'),
                  'starSelector/basic:candidateInterface2': path.join(folder, 'candidateInterface2.js'),
                  'starSelector/basic:candidateInterface:extended': path.join(folder, 'extendedCandidateInterface.js')
                });
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

  it('should apply use options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/starSelector/basic/*.js',
        '../fixtures/modules/starSelector/withUse/*.js'
      ]
    });

    var folderBasic = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/starSelector/basic/'));
    var folderWithUse = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/starSelector/withUse/'));

    Promise.resolve()
        .then(function () {

          return fireUp('starSelector/basic:*', { use: ['starSelector/basic:candidateInterface1'] })
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/basic:candidateInterface1': path.join(folderBasic, 'candidateInterface1.js'),
                  'starSelector/basic:candidateInterface2': path.join(folderBasic, 'candidateInterface2.js'),
                  'starSelector/basic:candidateInterface:extended': path.join(folderBasic, 'extendedCandidateInterface.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/basic/injectWithStarSelector', { use: ['starSelector/basic:candidateInterface1'] })
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/basic:candidateInterface1': path.join(folderBasic, 'candidateInterface1.js'),
                  'starSelector/basic:candidateInterface2': path.join(folderBasic, 'candidateInterface2.js'),
                  'starSelector/basic:candidateInterface:extended': path.join(folderBasic, 'extendedCandidateInterface.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/basic:*', { use: ['starSelector/basic:candidateInterface2:extended'] })
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/basic:candidateInterface1': path.join(folderBasic, 'candidateInterface1.js'),
                  'starSelector/basic:candidateInterface2:extended': path.join(folderWithUse, 'extendedCandidateInterface2.js'),
                  'starSelector/basic:candidateInterface:extended': path.join(folderBasic, 'extendedCandidateInterface.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/basic/injectWithStarSelector', { use: ['starSelector/basic:candidateInterface2:extended'] })
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/basic:candidateInterface1': path.join(folderBasic, 'candidateInterface1.js'),
                  'starSelector/basic:candidateInterface2:extended': path.join(folderWithUse, 'extendedCandidateInterface2.js'),
                  'starSelector/basic:candidateInterface:extended': path.join(folderBasic, 'extendedCandidateInterface.js')
                });
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

  it('should return an empty object if no implementation is available', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/starSelector/basic/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('unknownInterface:*')
              .then(function (instances) {
                expect(instances).toEqual({});
              });

        })
        .then(function () {

          return fireUp('starSelector/basic/injectWithStarSelector:*')
              .then(function (instances) {
                expect(instances).toEqual({});
              });

        })
        .then(function () {

          return fireUp('starSelector/basic/emptyInjectionWithStarSelector')
              .then(function (instances) {
                expect(instances).toEqual([{}, {}]);
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

  it('should throw an InstanceInitializationError if the initialization of one module fails', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/starSelector/initError/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('starSelector/initError/throwError:*')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.InstanceInitializationError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('starSelector/initError/injectThrowError')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.InstanceInitializationError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

  it('should throw an UseOptionConflictError if the use options conflict', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/starSelector/useConflict/*.js'],
      use: [
        'starSelector/useConflict/baseInterface:extendedInterface:extended1',
        'starSelector/useConflict/baseInterface:extendedInterface:extended2'
      ]
    });

    Promise.resolve()
        .then(function () {

          return fireUp('starSelector/useConflict/baseInterface:*')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('starSelector/useConflict/injectExtendedInterface')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

  it('should ignore ambiguous interfaces that extend deeper', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/starSelector/ambiguous/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/starSelector/ambiguous/'));

    Promise.resolve()
        .then(function () {

          return fireUp('starSelector/ambiguous/baseInterface:*')
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/ambiguous/baseInterface:extendedInterface2': path.join(folder, 'extendedInterface2.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/ambiguous/injectExtendedInterface')
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/ambiguous/baseInterface:extendedInterface2': path.join(folder, 'extendedInterface2.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/ambiguous/baseInterface:*', { use: ['starSelector/ambiguous/baseInterface:extendedInterface:extended1'] })
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/ambiguous/baseInterface:extendedInterface2': path.join(folder, 'extendedInterface2.js'),
                  'starSelector/ambiguous/baseInterface:extendedInterface:extended1': path.join(folder, 'extendedInterface.extended1.js')
                });
              });

        })
        .then(function () {

          return fireUp('starSelector/ambiguous/injectExtendedInterface', { use: ['starSelector/ambiguous/baseInterface:extendedInterface:extended1'] })
              .then(function (instances) {
                expect(instances).toEqual({
                  'starSelector/ambiguous/baseInterface:extendedInterface2': path.join(folder, 'extendedInterface2.js'),
                  'starSelector/ambiguous/baseInterface:extendedInterface:extended1': path.join(folder, 'extendedInterface.extended1.js')
                });
              });

        })
        .then(function () {
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

});