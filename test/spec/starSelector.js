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

});