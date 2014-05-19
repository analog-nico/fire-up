'use strict';

describe('Examples', function () {

  var fork = require('child_process').fork;
  var path = require('path');
  var request = require('supertest');
  var Promise = require('bluebird');

  var url = 'http://localhost:3000';

  it('server_vanilla.js', function (done) {

    var server = fork(path.join(__dirname, '../../example/server_vanilla.js'));

    server.on('message', function (message) {

      if (message !== 'running') {
        return;
      }

      request(url)
          .get('/')
          .expect(200)
          .expect('Hello World')
          .end(function (err, res) {
            server.kill('SIGINT');
            done(err);
          });

    });

  });

  it('server_fireup.js', function (done) {

    var server = fork(path.join(__dirname, '../../example/server_fireup.js'));

    server.on('message', function (message) {

      if (message !== 'running') {
        return;
      }

      request(url)
          .get('/')
          .expect(200)
          .expect('Hello World')
          .end(function (err, res) {
            server.kill('SIGINT');
            done(err);
          });

    });

  });

  it('server_fireup.js', function (done) {

    var server = fork(path.join(__dirname, '../../example/test/server_fireup_test.js'));

    server.on('message', function (message) {

      if (message !== 'running') {
        return;
      }

      request(url)
          .get('/')
          .expect(200)
          .expect('You are mocking me!')
          .end(function (err, res) {
            server.kill('SIGINT');
            done(err);
          });

    });

  });

  it('server_fireup_with_plugins.js', function (done) {

    var server = fork(path.join(__dirname, '../../example/server_fireup_with_plugins.js'));

    server.on('message', function (message) {

      if (message !== 'running') {
        return;
      }

      Promise.resolve()
          .then(function () {

            return new Promise(function (resolve, reject) {

              request(url)
                  .get('/')
                  .expect(200)
                  .expect('Hello World')
                  .end(function (err, res) {
                    if (err) {
                      reject(err);
                    }
                    resolve();
                  });

            });

          })
          .then(function () {

            return new Promise(function (resolve, reject) {

              request(url)
                  .get('/users/john')
                  .expect(200)
                  .expect('Hello john')
                  .end(function (err, res) {
                    if (err) {
                      reject(err);
                    }
                    resolve();
                  });

            });

          })
          .then(function () {

            return new Promise(function (resolve, reject) {

              request(url)
                  .get('/places/paris')
                  .expect(200)
                  .expect('Welcome to paris')
                  .end(function (err, res) {
                    if (err) {
                      reject(err);
                    }
                    resolve();
                  });

            });

          })
          .finally(function () {
            server.kill('SIGINT');
          })
          .then(function () {
            done();
          })
          .catch(function (err) {
            done(err);
          });

    });

  });

});