'use strict';

describe('Regarding injection, FireUp', function () {

  var path = require('path');
  var Promise = require('bluebird');
  var fireUpLib = require('../../lib/index.js');

  it('should load modules with direct (not cascading) dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/direct/*.js']
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
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should load modules with cascading dependencies', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/**/*.js', '!../fixtures/modules/interfaces/conflicts/*.js', '../fixtures/modules/injection/direct/*.js', '../fixtures/modules/injection/cascading/*.js']
    });

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/direct/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    fireUp('injection/cascading/injectAllDirect')
        .then(function (instance) {
          expect(instance).toEqual([
            path.join(folderInjection, 'noDependencies.js'),
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
      modules: ['../fixtures/modules/instantiation/staticargs/*.js']
    });

    Promise.resolve()
        .then(function () {

          return fireUp('instantiation/staticargs/takesStaticArgs(a string, false, 1, 1.5)');

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
          done();
        })
        .catch(function (e) {
          done(e);
        });

  });

  it('should initialize modules according to their type 1', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/type/*.js']
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

  it('should inject options', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/injection/fireup/*.js'],
      option1: 'option1',
      option2: 'option2'
    });

    Promise.resolve()
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

          return fireUp('injection/fireUp/currentInjector')
              .then(function (instance) {
                expect(instance).toBe(fireUp);
              });

        })
        .then(function () {

          return fireUp('fireUp/currentInjector')
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

  xit('should inject the injectionRequest');

});