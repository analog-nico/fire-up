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

    fireUp('starSelector/basic:*')
        .then(function (instances) {
          expect(instances).toEqual({
            'starSelector/basic:candidateInterface1': path.join(folder, 'candidateInterface1.js'),
            'starSelector/basic:candidateInterface2': path.join(folder, 'candidateInterface2.js'),
            'starSelector/basic:candidateInterface:extended': path.join(folder, 'extendedCandidateInterface.js')
          });
          done();
        })
        .catch(function (err) {
          done(err);
        });

  });

});