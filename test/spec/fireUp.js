'use strict';

describe('Regarding injection, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');
  var _ = require('lodash');

  it('should load instance modules with no dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/factoryAdapters/instance.js',
        {
          implements: 'dependentOn/instance',
          inject: 'instantiation/factoryAdapters/instance',
          factory: function (instance) {
            return instance;
          }
        }
      ]
    });

    Promise.resolve()
      .then(function () {

        return fireUp('instantiation/factoryAdapters/instance');

      })
      .then(function (instance) {
        expect(instance).toEqual({ me: 'instantiation/factoryAdapters/instance' });
      })
      .then(function () {

        return fireUp('dependentOn/instance');

      })
      .then(function (instance) {
        expect(instance).toEqual({ me: 'instantiation/factoryAdapters/instance' });
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should load modules with direct (not cascading) dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/interfaces/**/*.js',
        '!../fixtures/modules/interfaces/conflicts/*.js',
        '../fixtures/modules/injection/direct/*.js',
        {
          implements: 'injection/direct/singleDependencyAsString/customModule',
          inject: 'interfaces/unnested/singleAsString',
          factory: function (singleAsString) {
            return [singleAsString];
          }
        },
        '../fixtures/modules/instantiation/factoryAdapters/*.js'
      ]
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/direct/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    Promise.resolve()
        .then(function () {

          return fireUp('injection/direct/noDependencies');

        })
        .then(function (instance) {
          expect(instance).toEqual(path.join(folderInjection, 'noDependencies.js'));
        })
        .then(function () {

          return fireUp('injection/direct/singleDependencyAsString');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folderInterfaces, 'unnested/singleAsString.js')]);
        })
        .then(function () {

          return fireUp('injection/direct/singleDependencyAsString/customModule');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folderInterfaces, 'unnested/singleAsString.js')]);
        })
        .then(function () {

          return fireUp('injection/direct/singleDependencyAsList');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folderInterfaces, 'unnested/singleAsList.js')]);
        })
        .then(function () {

          return fireUp('injection/direct/injectBaseInterfaces');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInterfaces, 'unnested/singleAsList.js'),
            path.join(folderInterfaces, 'unnested/multiple.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseInterface1.js'),
            path.join(folderInterfaces, 'nested/baseInterface2.js'),
            path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js')
          ]);
        })
        .then(function () {

          return fireUp('injection/direct/injectSubInterfaces');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
            path.join(folderInterfaces, 'nested/subInterface1.js'),
            path.join(folderInterfaces, 'nested/subInterface2.js'),
            path.join(folderInterfaces, 'nested/subInterfaceWithoutBase1.js'),
            path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js'),
            path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js')
          ]);
        })
        .then(function () {

          return fireUp('injection/direct/takesStaticArgs(staticArg)');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInterfaces, 'unnested/singleAsList.js'),
            'staticArg'
          ]);
        })
        .then(function () {

          return fireUp('instantiation/factoryAdapters/constructorWithDependencies');

        })
        .then(function (instance) {
          expect(instance.getMe()).toEqual([
            'instantiation/factoryAdapters/constructorWithDependencies',
            'instantiation/factoryAdapters/constructor',
            'instantiation/factoryAdapters/constructorMultiple'
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should load modules with cascading dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/interfaces/**/*.js',
        '!../fixtures/modules/interfaces/conflicts/*.js',
        '../fixtures/modules/injection/direct/*.js',
        '../fixtures/modules/injection/cascading/*.js',
        {
          implements: 'injection/direct/singleDependencyAsString/customModule',
          inject: 'interfaces/unnested/singleAsString',
          factory: function (singleAsString) {
            return [singleAsString];
          }
        }
      ]
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/direct/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    fireUp('injection/cascading/injectAllDirect')
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInjection, 'noDependencies.js'),
            [path.join(folderInterfaces, 'unnested/singleAsString.js')],
            [path.join(folderInterfaces, 'unnested/singleAsString.js')],
            [path.join(folderInterfaces, 'unnested/singleAsList.js')],
            [
              path.join(folderInterfaces, 'unnested/singleAsList.js'),
              path.join(folderInterfaces, 'unnested/multiple.js'),
              path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
              path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
              path.join(folderInterfaces, 'nested/baseInterface1.js'),
              path.join(folderInterfaces, 'nested/baseInterface2.js'),
              path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js')
            ],
            [
              path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
              path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
              path.join(folderInterfaces, 'nested/baseAndSubInterface.js'),
              path.join(folderInterfaces, 'nested/subInterface1.js'),
              path.join(folderInterfaces, 'nested/subInterface2.js'),
              path.join(folderInterfaces, 'nested/subInterfaceWithoutBase1.js'),
              path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js'),
              path.join(folderInterfaces, 'nested/subSubInterfaceWithoutBase.js')
            ],
            [
              path.join(folderInterfaces, 'unnested/singleAsList.js'),
              43
            ]
          ]);
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should load modules with static arguments', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/staticargs/*.js',
        {
          implements: 'instantiation/staticargs/takesStaticArgs/customModule',
          type: fireUpLib.constants.MODULE_TYPE_MULTIPLE_INSTANCES,
          factory: function (arg1, arg2, arg3, arg4) {
            return [arg1, arg2, arg3, arg4];
          }
        },
        '../fixtures/modules/instantiation/factoryAdapters/*.js'
      ]
    });

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/staticargs/takesStaticArgs(a string, false, 1, 1.5)');

        })
        .then(function (instance) {
          expect(instance).toEqual(['a string', false, 1, 1.5]);
        })
        .then(function () {

          return fireUp('instantiation/staticargs/takesStaticArgs/customModule(a string, false, 1, 1.5)');

        })
        .then(function (instance) {
          expect(instance).toEqual(['a string', false, 1, 1.5]);
        })
        .then(function () {

          return fireUp('instantiation/staticargs/injectWithStaticArgs');

        })
        .then(function (instance) {
          expect(instance).toEqual(['string', true, 0, 0.5]);
        })
        .then(function () {

          return fireUp('instantiation/factoryAdapters/constructorMultipleStaticArg(42)');

        })
        .then(function (instance) {
          expect(instance.staticArg).toBe(42);
        })
        .then(function () {

          return fireUp('instantiation/factoryAdapters/constructorDateMultiple(2014, 6, 23, 20, 22, 30, 101)');

        })
        .then(function (instance) {
          expect(instance.toISOString()).toEqual((new Date(2014, 6, 23, 20, 22, 30, 101)).toISOString());
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 1', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/type/*.js',
        {
          implements: 'instantiation/type/singleton/customModule',
          type: fireUpLib.constants.MODULE_TYPE_SINGLETON,
          counter: 0,
          factory: function () { this.counter += 1; return this.counter; }
        }
      ]
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/singleton/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singleton.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singleton/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singleton.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singleton/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singleton.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstances/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstances.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstances/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstances.js'), 2]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstances/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstances.js'), 3]);
        })
        .then(function () {

          return fireUp('instantiation/type/singleton/customModule');

        })
        .then(function (instance) {
          expect(instance).toEqual(1);
        })
        .then(function () {

          return fireUp('instantiation/type/singleton/customModule');

        })
        .then(function (instance) {
          expect(instance).toEqual(1);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 2', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectAllTypes');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singleton.js'), 2],
            [path.join(folder, 'singleton.js'), 2],
            [path.join(folder, 'singleton.js'), 2],
            [path.join(folder, 'multiInstances.js'), 4],
            [path.join(folder, 'multiInstances.js'), 5],
            [path.join(folder, 'multiInstances.js'), 6]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 3', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/singletonAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singletonAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singletonAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singletonAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/singletonAsync/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'singletonAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstancesAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstancesAsync.js'), 1]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstancesAsync/interface1');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstancesAsync.js'), 2]);
        })
        .then(function () {

          return fireUp('instantiation/type/multiInstancesAsync/interface2');

        })
        .then(function (instance) {
          expect(instance).toEqual([path.join(folder, 'multiInstancesAsync.js'), 3]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 4', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesAsync');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singletonAsync.js'), 2],
            [path.join(folder, 'singletonAsync.js'), 2],
            [path.join(folder, 'singletonAsync.js'), 2],
            [path.join(folder, 'multiInstancesAsync.js'), 4],
            [path.join(folder, 'multiInstancesAsync.js'), 5],
            [path.join(folder, 'multiInstancesAsync.js'), 6]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 5', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesMixed');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singletonAsync.js'), 3],
            [path.join(folder, 'singleton.js'), 3],
            [path.join(folder, 'singletonAsync.js'), 3],
            [path.join(folder, 'multiInstancesAsync.js'), 7],
            [path.join(folder, 'multiInstances.js'), 7],
            [path.join(folder, 'multiInstancesAsync.js'), 8]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 6', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesMixedCascading');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singletonAsync.js'), 4],
            [path.join(folder, 'singleton.js'), 4],
            [path.join(folder, 'multiInstancesAsync.js'), 9],
            [path.join(folder, 'multiInstances.js'), 8],
            [
              [path.join(folder, 'singletonAsync.js'), 4],
              [path.join(folder, 'singleton.js'), 4],
              [path.join(folder, 'singletonAsync.js'), 4],
              [path.join(folder, 'multiInstancesAsync.js'), 10],
              [path.join(folder, 'multiInstances.js'), 9],
              [path.join(folder, 'multiInstancesAsync.js'), 11]
            ],
            [
              [path.join(folder, 'singleton.js'), 4],
              [path.join(folder, 'singleton.js'), 4],
              [path.join(folder, 'singleton.js'), 4],
              [path.join(folder, 'multiInstances.js'), 10],
              [path.join(folder, 'multiInstances.js'), 11],
              [path.join(folder, 'multiInstances.js'), 12]
            ],
            [
              [path.join(folder, 'singletonAsync.js'), 4],
              [path.join(folder, 'singletonAsync.js'), 4],
              [path.join(folder, 'singletonAsync.js'), 4],
              [path.join(folder, 'multiInstancesAsync.js'), 12],
              [path.join(folder, 'multiInstancesAsync.js'), 13],
              [path.join(folder, 'multiInstancesAsync.js'), 14]
            ],
            [path.join(folder, 'singletonAsync.js'), 4],
            [path.join(folder, 'singleton.js'), 4],
            [path.join(folder, 'multiInstancesAsync.js'), 15],
            [path.join(folder, 'multiInstances.js'), 13]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 7', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectAndFireUp');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [path.join(folder, 'singleton.js'), 5],
            [path.join(folder, 'singleton.js'), 5],
            [path.join(folder, 'multiInstances.js'), 14],
            [path.join(folder, 'multiInstances.js'), 15]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 8', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectAllTypesTwiceSync');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [
              [path.join(folder, 'singleton.js'), 6],
              [path.join(folder, 'singleton.js'), 6],
              [path.join(folder, 'singleton.js'), 6],
              [path.join(folder, 'multiInstances.js'), 16],
              [path.join(folder, 'multiInstances.js'), 17],
              [path.join(folder, 'multiInstances.js'), 18]
            ],
            [
              [path.join(folder, 'singleton.js'), 6],
              [path.join(folder, 'singleton.js'), 6],
              [path.join(folder, 'singleton.js'), 6],
              [path.join(folder, 'multiInstances.js'), 19],
              [path.join(folder, 'multiInstances.js'), 20],
              [path.join(folder, 'multiInstances.js'), 21]
            ]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 9', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/type/injectSingletonsWithDependencyTwiceSync');

        })
        .then(function (instance) {
          expect(instance).toEqual([
            [
              [path.join(folder, 'singletonWithDependency.js'), 1],
              [path.join(folder, 'singletonWithDependency.js'), 1],
              [path.join(folder, 'singletonWithDependency.js'), 1]
            ],
            [
              [path.join(folder, 'singletonWithDependency.js'), 1],
              [path.join(folder, 'singletonWithDependency.js'), 1],
              [path.join(folder, 'singletonWithDependency.js'), 1]
            ]
          ]);
        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should load instance modules according to their type', function (done) {

    var myInstance = { test: '===' };

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        {
          implements: 'myInstance',
          instance: myInstance
        },
        {
          implements: 'myInstance2',
          instance: myInstance,
          type: fireUpLib.constants.MODULE_TYPE_SINGLETON
        },
        '../fixtures/modules/instantiation/factoryAdapters/instanceMultiple.js'
      ]
    });

    Promise.resolve()
      .then(function () {

        return fireUp('myInstance');

      })
      .then(function (instance) {
        expect(instance).toBe(myInstance);
      })
      .then(function () {

        return fireUp('myInstance2');

      })
      .then(function (instance) {
        expect(instance).toBe(myInstance);
      })
      .then(function () {

        return Promise.all([
          fireUp('myInstance'),
          fireUp('myInstance'),
          fireUp('myInstance2')
        ]);

      })
      .then(function (instances) {
        expect(instances[0]).toBe(instances[1]);
        expect(instances[1]).toBe(instances[2]);

        instances[0].attr = 'xyz';
        expect(instances[0]).toEqual(instances[1]);
      })
      .then(function () {

        return fireUp('instantiation/factoryAdapters/instanceMultiple');

      })
      .then(function (instance) {
        expect(instance).toEqual({ me: 'instantiation/factoryAdapters/instanceMultiple' });
      })
      .then(function () {

        return Promise.all([
          fireUp('instantiation/factoryAdapters/instanceMultiple'),
          fireUp('instantiation/factoryAdapters/instanceMultiple')
        ]);

      })
      .then(function (instances) {
        expect(instances[0]).not.toBe(instances[1]);
        expect(instances[0]).toEqual(instances[1]);

        instances[0].attr = 'xyz';
        expect(instances[0]).not.toEqual(instances[1]);
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should load constructor modules according to their type', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/factoryAdapters/*.js',
        {
          implements: 'dependsOn/constructor',
          inject: 'instantiation/factoryAdapters/constructor',
          factory: function (instance) {
            return instance;
          }
        }
      ]
    });

    Promise.resolve()
      .then(function () {

        return fireUp('instantiation/factoryAdapters/constructor');

      })
      .then(function (instance) {
        expect(instance.getMe()).toEqual('instantiation/factoryAdapters/constructor');
        expect(instance.index).toBe(1);
      })
      .then(function () {

        return fireUp('dependsOn/constructor');

      })
      .then(function (instance) {
        expect(instance.getMe()).toEqual('instantiation/factoryAdapters/constructor');
        expect(instance.index).toBe(1);
      })
      .then(function () {

        return Promise.all([
          fireUp('instantiation/factoryAdapters/constructor'),
          fireUp('instantiation/factoryAdapters/constructor'),
          fireUp('dependsOn/constructor')
        ]);

      })
      .then(function (instances) {
        expect(instances[0]).toBe(instances[1]);
        expect(instances[1]).toBe(instances[2]);
      })
      .then(function () {

        return fireUp('instantiation/factoryAdapters/constructorMultiple');

      })
      .then(function (instance) {
        expect(instance.getMe()).toEqual('instantiation/factoryAdapters/constructorMultiple');
        expect(instance.index).toBe(1);
      })
      .then(function () {

        return fireUp('instantiation/factoryAdapters/constructorMultiple');

      })
      .then(function (instance) {
        expect(instance.getMe()).toEqual('instantiation/factoryAdapters/constructorMultiple');
        expect(instance.index).toBe(2);
      })
      .then(function () {

        return Promise.all([
          fireUp('instantiation/factoryAdapters/constructorMultiple'),
          fireUp('instantiation/factoryAdapters/constructor')
        ]);

      })
      .then(function (instances) {
        expect(instances[0]).not.toBe(instances[1]);
        instances[0].test = 'x';
        expect(instances[1].test).not.toBeDefined();
      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should return module instances of different type', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/returnValue/*.js']
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/returnValue/'));

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/returnValue/simpleValue')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folder, 'simpleValue.js'));
              });

        })
        .then(function () {

          return fireUp('instantiation/returnValue/simpleValueAsync')
              .then(function (instance) {
                expect(instance).toEqual(path.join(folder, 'simpleValueAsync.js'));
              });

        })
        .then(function () {

          return fireUp('instantiation/returnValue/object')
              .then(function (instance) {
                expect(instance).toEqual({ path: path.join(folder, 'object.js') });
              });

        })
        .then(function () {

          return fireUp('instantiation/returnValue/objectAsync')
              .then(function (instance) {
                expect(instance).toEqual({ path: path.join(folder, 'objectAsync.js') });
              });

        })
        .then(function () {

          return fireUp('instantiation/returnValue/function')
              .then(function (instance) {
                expect(instance()).toEqual(path.join(folder, 'function.js'));
              });

        })
        .then(function () {

          return fireUp('instantiation/returnValue/functionAsync')
              .then(function (instance) {
                expect(instance()).toEqual(path.join(folder, 'functionAsync.js'));
              });

        })
        .then(function () {

          return fireUp('instantiation/returnValue/loadAll')
              .then(function (instance) {
                instance[4] = instance[4]();
                instance[5] = instance[5]();
                expect(instance).toEqual([
                  path.join(folder, 'simpleValue.js'),
                  path.join(folder, 'simpleValueAsync.js'),
                  { path: path.join(folder, 'object.js') },
                  { path: path.join(folder, 'objectAsync.js') },
                  path.join(folder, 'function.js'),
                  path.join(folder, 'functionAsync.js')
                ]);
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should invoke the factory method with correct this pointer', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/special/thisPointer.js',
        {
          implements: 'special/thisPointer/customModule',
          property: 'custom module',
          factory: function () {
            return this.property;
          }
        }
      ]
    });

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/special/'));

    Promise.resolve()
      .then(function () {

        return fireUp('special/thisPointer')
          .then(function (instance) {
            expect(instance).toEqual(path.join(folder, 'thisPointer.js'));
          });

      })
      .then(function () {

        return fireUp('special/thisPointer/customModule')
          .then(function (instance) {
            expect(instance).toEqual('custom module');
          });

      })
      .then(function () {
        done();
      })
      .catch(function (e) {
        done(e);
      });

  });

  it('should inject options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/fireup/*.js'],
      option1: 'option1',
      option2: 'option2'
    });

    Promise.resolve()
        .then(function () {

          return fireUp('fireUp/options:unknown')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function () {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('fireUp/options')
              .then(function (instance) {
                var options = {
                  option1: instance.option1,
                  option2: instance.option2
                };
                expect(options).toEqual({
                  option1: 'option1',
                  option2: 'option2'
                });
              });

        })
        .then(function () {

          return fireUp('fireUp/options', { option2: 'overwritten', option3: 'extra' })
              .then(function (instance) {
                var options = {
                  option1: instance.option1,
                  option2: instance.option2,
                  option3: instance.option3
                };
                expect(options).toEqual({
                  option1: 'option1',
                  option2: 'overwritten',
                  option3: 'extra'
                });
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/options')
              .then(function (instance) {
                var options = {
                  option1: instance.option1,
                  option2: instance.option2
                };
                expect(options).toEqual({
                  option1: 'option1',
                  option2: 'option2'
                });
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/options', { option2: 'overwritten', option3: 'extra' })
              .then(function (instance) {
                var options = {
                  option1: instance.option1,
                  option2: instance.option2,
                  option3: instance.option3
                };
                expect(options).toEqual({
                  option1: 'option1',
                  option2: 'overwritten',
                  option3: 'extra'
                });
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/options', { option1: 'overwritten2', option4: 'extra2' })
              .then(function (instance) {
                var options = {
                  option1: instance.option1,
                  option2: instance.option2,
                  option3: instance.option3,
                  option4: instance.option4
                };
                expect(options).toEqual({
                  option1: 'overwritten2',
                  option2: 'option2',
                  option3: undefined,
                  option4: 'extra2'
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

  it('should inject the current injector', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/fireup/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('fireUp/currentInjector:unknown')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function () {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('fireUp/currentInjector')
              .then(function (instance) {
                expect(instance).toBe(fireUp);
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/currentInjector')
              .then(function (instance) {
                expect(instance).toBe(fireUp);
              });

        })
        .then(function () {
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should inject the injectionRequest', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/fireup/*.js'],
      option1: 'option1',
      option2: 'option2'
    });

    Promise.resolve()
        .then(function () {

          return fireUp('fireUp/injectionRequest:unknown')
              .then(function () {
                done(new Error('fireUp should have rejected the promise.'));
              })
              .catch(fireUp.errors.NoImplementationError, function () {
                // This is expected to be called.
              });

        })
        .then(function () {

          return fireUp('fireUp/injectionRequest')
              .then(function (injectionRequest) {
                expect(injectionRequest).toBeUndefined();
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/injectionRequest')
              .then(function (injectionRequest) {
                expect(_.isPlainObject(injectionRequest)).toBe(true);
                expect(injectionRequest.moduleReference).toEqual('injection/fireUp/injectionRequest');
                expect(injectionRequest.parsedModuleReference).toEqual({ segments: ['injection/fireUp/injectionRequest'], args: [] });
                expect(injectionRequest.usedInterface).toEqual('injection/fireUp/injectionRequest');
                expect(injectionRequest.implementedByVirtualModule).toBe(false);
                expect(injectionRequest.cachedModule).toBe(require('../fixtures/modules/injection/fireup/injectionRequest.js'));
                expect(injectionRequest.parent).toBeUndefined();
                expect(injectionRequest.nestingLevel).toEqual(0);
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/injectionRequest(test, 2)')
              .then(function (injectionRequest) {
                expect(injectionRequest.moduleReference).toEqual('injection/fireUp/injectionRequest(test, 2)');
                expect(injectionRequest.parsedModuleReference).toEqual({ segments: ['injection/fireUp/injectionRequest'], args: ['test', 2] });
                expect(injectionRequest.usedInterface).toEqual('injection/fireUp/injectionRequest');
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/nestedInjectionRequest')
              .then(function (injectionRequest) {
                expect(injectionRequest.moduleReference).toEqual('injection/fireUp/injectionRequest');
                expect(injectionRequest.usedInterface).toEqual('injection/fireUp/injectionRequest');
                expect(injectionRequest.cachedModule).toBe(require('../fixtures/modules/injection/fireup/injectionRequest.js'));
                expect(injectionRequest.nestingLevel).toEqual(1);

                expect(_.isPlainObject(injectionRequest.parent)).toBe(true);
                expect(injectionRequest.parent.moduleReference).toEqual('injection/fireUp/nestedInjectionRequest');
                expect(injectionRequest.parent.parsedModuleReference).toEqual({ segments: ['injection/fireUp/nestedInjectionRequest'], args: [] });
                expect(injectionRequest.parent.usedInterface).toEqual('injection/fireUp/nestedInjectionRequest');
                expect(injectionRequest.parent.implementedByVirtualModule).toBe(false);
                expect(injectionRequest.parent.cachedModule).toBe(require('../fixtures/modules/injection/fireup/nestedInjectionRequest.js'));
                expect(injectionRequest.parent.parent).toBeUndefined();
                expect(injectionRequest.parent.nestingLevel).toEqual(0);
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/injectionRequest:*')
              .then(function (instances) {
                expect(_.isPlainObject(instances['injection/fireUp/injectionRequest:plain'])).toBe(true);
                expect(instances['injection/fireUp/injectionRequest:plain'].moduleReference).toEqual('injection/fireUp/injectionRequest:plain');
                expect(instances['injection/fireUp/injectionRequest:plain'].parsedModuleReference).toEqual({ segments: ['injection/fireUp/injectionRequest', 'plain'], args: [] });
                expect(instances['injection/fireUp/injectionRequest:plain'].usedInterface).toEqual('injection/fireUp/injectionRequest:plain');
                expect(instances['injection/fireUp/injectionRequest:plain'].implementedByVirtualModule).toBe(false);
                expect(instances['injection/fireUp/injectionRequest:plain'].cachedModule).toBe(require('../fixtures/modules/injection/fireup/injectionRequest.js'));
                expect(instances['injection/fireUp/injectionRequest:plain'].parent).not.toBeUndefined();
                expect(instances['injection/fireUp/injectionRequest:plain'].nestingLevel).toEqual(1);

                expect(_.isPlainObject(instances['injection/fireUp/injectionRequest:plain'].parent)).toBe(true);
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.moduleReference).toEqual('injection/fireUp/injectionRequest:*');
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.parsedModuleReference).toEqual({ segments: ['injection/fireUp/injectionRequest', '*'], args: [] });
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.usedInterface).toBeUndefined();
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.implementedByVirtualModule).toBe(true);
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.cachedModule).toBeUndefined();
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.parent).toBeUndefined();
                expect(instances['injection/fireUp/injectionRequest:plain'].parent.nestingLevel).toEqual(0);

                expect(instances['injection/fireUp/injectionRequest:nested'].moduleReference).toEqual('injection/fireUp/injectionRequest');
                expect(instances['injection/fireUp/injectionRequest:nested'].usedInterface).toEqual('injection/fireUp/injectionRequest');
                expect(instances['injection/fireUp/injectionRequest:nested'].cachedModule).toBe(require('../fixtures/modules/injection/fireup/injectionRequest.js'));
                expect(instances['injection/fireUp/injectionRequest:nested'].nestingLevel).toEqual(2);

                expect(_.isPlainObject(instances['injection/fireUp/injectionRequest:nested'].parent)).toBe(true);
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.moduleReference).toEqual('injection/fireUp/injectionRequest:nested');
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.parsedModuleReference).toEqual({ segments: ['injection/fireUp/injectionRequest', 'nested'], args: [] });
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.usedInterface).toEqual('injection/fireUp/injectionRequest:nested');
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.implementedByVirtualModule).toBe(false);
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.cachedModule).toBe(require('../fixtures/modules/injection/fireup/nestedInjectionRequest.js'));
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.parent).not.toBeUndefined();
                expect(instances['injection/fireUp/injectionRequest:nested'].parent.nestingLevel).toEqual(1);

                expect(instances['injection/fireUp/injectionRequest:nested'].parent.parent).toEqual(instances['injection/fireUp/injectionRequest:plain'].parent);
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/injectionRequest/base')
              .then(function (injectionRequest) {
                expect(injectionRequest.moduleReference).toEqual('injection/fireUp/injectionRequest/base');
                expect(injectionRequest.usedInterface).toEqual('injection/fireUp/injectionRequest/base');
              });

        })
        .then(function () {

          return fireUp('injection/fireUp/injectionRequest/base', { use: ['injection/fireUp/injectionRequest/base:plain'] })
              .then(function (injectionRequest) {
                expect(injectionRequest.moduleReference).toEqual('injection/fireUp/injectionRequest/base');
                expect(injectionRequest.usedInterface).toEqual('injection/fireUp/injectionRequest/base:plain');
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