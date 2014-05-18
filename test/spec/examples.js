'use strict';

describe('Examples', function () {

  var fork = require('child_process').fork;
  var path = require('path');
  var request = require('supertest');

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

});