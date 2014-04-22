'use strict';

describe('Regarding injection with use, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');


  it('should use the sub interface provided through newInjector(...)', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js'],
      use: ['interfaces/nested/baseInterface1:subInterface1']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subInterface1.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subInterface1.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should use the sub interface provided through fireUp(...)', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subInterface1.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subInterface1.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should skip any interfaces that do not match', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js'],
      use: ['interfaces/nested/baseInterface2:subInterface1']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/baseInterface1.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/baseInterface1.js'));
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1:subInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subInterface1.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectSubInterface', { use: ['interfaces/nested/baseInterface1:subInterface1'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subInterface1.js'));
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1:subInterface1:subSubInterface', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1',
              'interfaces/nested/baseInterface1:subInterface2',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface2'
            ]
          })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfSubInterface.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectSubSubInterface', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1',
              'interfaces/nested/baseInterface1:subInterface2',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface2'
            ]
          })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfSubInterface.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should use the sub sub interface where the sub sub interface is given', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js'],
      use: ['interfaces/nested/baseInterface2:subInterface:subSubInterface']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface2')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfBaseInterface.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface2')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfBaseInterface.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should use the sub sub interface where just the sub interface is given', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js'],
      use: ['interfaces/nested/baseInterface2:subInterface']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface2')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfBaseInterface.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface2')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfBaseInterface.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should use the sub sub interface where the sub interface and the sub sub interface is given', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js'],
      use: ['interfaces/nested/baseInterface1:subInterface1']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1:subSubInterface'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfSubInterface.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1:subSubInterface'] })
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfSubInterface.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should reject if used interface is not implemented', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', { use: ['interfaces/nested/baseInterface1:implementationNotExisting'] })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', { use: ['interfaces/nested/baseInterface1:implementationNotExisting'] })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1:implementationNotExisting'] })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', { use: ['interfaces/nested/baseInterface1:subInterface1:implementationNotExisting'] })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.NoImplementationError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should reject on conflicting interfaces with same depth in the use options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1',
              'interfaces/nested/baseInterface1:subInterface2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1',
              'interfaces/nested/baseInterface1:subInterface2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1:subsub1',
              'interfaces/nested/baseInterface1:subInterface1:subsub2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1:subsub1',
              'interfaces/nested/baseInterface1:subInterface1:subsub2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1:subsub1',
              'interfaces/nested/baseInterface1:subInterface2:subsub2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1:subsub1',
              'interfaces/nested/baseInterface1:subInterface2:subsub2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should reject on conflicting interfaces with different depth in the use options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1',
              'interfaces/nested/baseInterface1:subInterface2',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1',
              'interfaces/nested/baseInterface1:subInterface2',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface2:subSubInterface:subsubsub',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface2:subSubInterface:subsubsub',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface1:subsubsub',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('injection/use/injectBaseInterface1', {
            use: [
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface1:subsubsub',
              'interfaces/nested/baseInterface1:subInterface1:subSubInterface2'
            ]
          })
              .then(function (instance) {
                throw new Error('fireUp should have rejected the promise.');
              })
              .catch(fireUp.errors.UseOptionConflictError, function (e) {
                // This is expected to be called.
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should not be influences if the use options also contain the requested interface', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/use/*.js'],
      use: [
        'interfaces/nested/baseInterface1:subInterface1',
        'interfaces/nested/baseInterface1:subInterface1:subSubInterface'
      ]
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/use/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('interfaces/nested/baseInterface1:subInterface1')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfSubInterface.js'));
              });

        })
        .then(function () {

          return fireUp('injection/use/injectSubInterface')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folderInterfaces, 'nested/subSubInterfaceOfSubInterface.js'));
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

});
