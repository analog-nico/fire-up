'use strict';

describe('Parallel FireUp calls', function () {

  var fireUpLib = require('../../lib/index.js');
  var path = require('path');
  var BPromise = require('bluebird');
  var _ = require('lodash');

  it('should be independent for multiple injectors and no dependent modules', function (done) {

    var injectors = [];

    for ( var i = 0; i < 100; i+=1 ) {
      injectors[i] = fireUpLib.newInjector({
        basePath: __dirname,
        modules: [
          '../fixtures/modules/instantiation/type/**/*.js'
        ]
      });
    }

    var interfaces = [
      'instantiation/type/multiInstances/interface1',
      'instantiation/type/multiInstances/interface2',
      'instantiation/type/multiInstancesAsync/interface1',
      'instantiation/type/multiInstancesAsync/interface2',
      'instantiation/type/singleton/interface1',
      'instantiation/type/singleton/interface2',
      'instantiation/type/singletonAsync/interface1',
      'instantiation/type/singletonAsync/interface2',
      'instantiation/type/singletonWithDependency/interface1',
      'instantiation/type/singletonWithDependency/interface2'
    ];

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    var modules = [
      path.join(folder, 'multiInstances.js'),
      path.join(folder, 'multiInstances.js'),
      path.join(folder, 'multiInstancesAsync.js'),
      path.join(folder, 'multiInstancesAsync.js'),
      path.join(folder, 'singleton.js'),
      path.join(folder, 'singleton.js'),
      path.join(folder, 'singletonAsync.js'),
      path.join(folder, 'singletonAsync.js'),
      path.join(folder, 'singletonWithDependency.js'),
      path.join(folder, 'singletonWithDependency.js')
    ];

    var instantiationPromises = [];

    function invokeFireUp(k) {
      return injectors[k](interfaces[k % modules.length])
        .then(function (module) {
          expect(module[0]).toEqual(modules[k % modules.length]);
        });
    }

    for ( var k = 0; k < injectors.length; k+=1 ) {
      instantiationPromises[k] = invokeFireUp(k);
    }

    BPromise.all(instantiationPromises)
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should be independent for one injector and no dependent modules', function (done) {

    var injector = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/type/**/*.js'
      ]
    });

    var interfaces = [
      'instantiation/type/multiInstances/interface1',
      'instantiation/type/multiInstances/interface2',
      'instantiation/type/multiInstancesAsync/interface1',
      'instantiation/type/multiInstancesAsync/interface2',
      'instantiation/type/singleton/interface1',
      'instantiation/type/singleton/interface2',
      'instantiation/type/singletonAsync/interface1',
      'instantiation/type/singletonAsync/interface2',
      'instantiation/type/singletonWithDependency/interface1',
      'instantiation/type/singletonWithDependency/interface2'
    ];

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    var modules = [
      path.join(folder, 'multiInstances.js'),
      path.join(folder, 'multiInstances.js'),
      path.join(folder, 'multiInstancesAsync.js'),
      path.join(folder, 'multiInstancesAsync.js'),
      path.join(folder, 'singleton.js'),
      path.join(folder, 'singleton.js'),
      path.join(folder, 'singletonAsync.js'),
      path.join(folder, 'singletonAsync.js'),
      path.join(folder, 'singletonWithDependency.js'),
      path.join(folder, 'singletonWithDependency.js')
    ];

    var instantiationPromises = [];

    function invokeFireUp(k) {
      return injector(interfaces[k % modules.length])
        .then(function (module) {
          expect(module[0]).toEqual(modules[k % modules.length]);
        });
    }

    for ( var k = 0; k < 100; k+=1 ) {
      instantiationPromises[k] = invokeFireUp(k);
    }

    BPromise.all(instantiationPromises)
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should be independent for multiple injectors and with dependent modules', function (done) {

    var injectors = [];

    for ( var i = 0; i < 100; i+=1 ) {
      injectors[i] = fireUpLib.newInjector({
        basePath: __dirname,
        modules: [
          '../fixtures/modules/instantiation/type/**/*.js'
        ]
      });
    }

    var interfaces = [
      'instantiation/type/injectAllTypes',
      'instantiation/type/injectAllTypesAsync',
      'instantiation/type/injectAllTypesMixed',
      'instantiation/type/injectAllTypesMixedCascading',
      'instantiation/type/injectAllTypesTwiceSync',
      'instantiation/type/injectAndFireUp',
      'instantiation/type/injectSingletonsWitDependency',
      'instantiation/type/injectSingletonsWithDependencyTwiceSync'
    ];

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    var modules = [
      [
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstances.js')
      ],
      [
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstancesAsync.js')
      ],
      [
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstancesAsync.js')
      ],
      [
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstances.js'),
        [
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'multiInstancesAsync.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstancesAsync.js')
        ],
        [
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js')
        ],
        [
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'multiInstancesAsync.js'),
          path.join(folder, 'multiInstancesAsync.js'),
          path.join(folder, 'multiInstancesAsync.js')
        ],
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstances.js')
      ],
      [
        [
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js')
        ],
        [
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js')
        ]
      ],
      [
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstances.js')
      ],
      [
        path.join(folder, 'singletonWithDependency.js'),
        path.join(folder, 'singletonWithDependency.js'),
        path.join(folder, 'singletonWithDependency.js')
      ],
      [
        [
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js')
        ],
        [
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js')
        ]
      ]
    ];

    var instantiationPromises = [];

    function removeCounters(module) {
      if (_.isArray(module)) {
        if (module.length === 2 && _.isString(module[0]) && _.isNumber(module[1])) {
          return module[0];
        } else {
          return _.map(module, removeCounters);
        }
      } else {
        return module;
      }
    }

    function invokeFireUp(k) {
      return injectors[k](interfaces[k % modules.length])
        .then(function (module) {
          module = removeCounters(module);
          expect(module).toEqual(modules[k % modules.length]);
        });
    }

    for ( var k = 0; k < injectors.length; k+=1 ) {
      instantiationPromises[k] = invokeFireUp(k);
    }

    BPromise.all(instantiationPromises)
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should be independent for one injector and with dependent modules', function (done) {

    var injector = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [
        '../fixtures/modules/instantiation/type/**/*.js'
      ]
    });

    var interfaces = [
      'instantiation/type/injectAllTypes',
      'instantiation/type/injectAllTypesAsync',
      'instantiation/type/injectAllTypesMixed',
      'instantiation/type/injectAllTypesMixedCascading',
      'instantiation/type/injectAllTypesTwiceSync',
      'instantiation/type/injectAndFireUp',
      'instantiation/type/injectSingletonsWitDependency',
      'instantiation/type/injectSingletonsWithDependencyTwiceSync'
    ];

    var folder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/type/'));

    var modules = [
      [
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstances.js')
      ],
      [
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstancesAsync.js')
      ],
      [
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstancesAsync.js')
      ],
      [
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstances.js'),
        [
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'multiInstancesAsync.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstancesAsync.js')
        ],
        [
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js')
        ],
        [
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'singletonAsync.js'),
          path.join(folder, 'multiInstancesAsync.js'),
          path.join(folder, 'multiInstancesAsync.js'),
          path.join(folder, 'multiInstancesAsync.js')
        ],
        path.join(folder, 'singletonAsync.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstancesAsync.js'),
        path.join(folder, 'multiInstances.js')
      ],
      [
        [
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js')
        ],
        [
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'singleton.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js'),
          path.join(folder, 'multiInstances.js')
        ]
      ],
      [
        path.join(folder, 'singleton.js'),
        path.join(folder, 'singleton.js'),
        path.join(folder, 'multiInstances.js'),
        path.join(folder, 'multiInstances.js')
      ],
      [
        path.join(folder, 'singletonWithDependency.js'),
        path.join(folder, 'singletonWithDependency.js'),
        path.join(folder, 'singletonWithDependency.js')
      ],
      [
        [
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js')
        ],
        [
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js'),
          path.join(folder, 'singletonWithDependency.js')
        ]
      ]
    ];

    var instantiationPromises = [];

    function removeCounters(module) {
      if (_.isArray(module)) {
        if (module.length === 2 && _.isString(module[0]) && _.isNumber(module[1])) {
          return module[0];
        } else {
          return _.map(module, removeCounters);
        }
      } else {
        return module;
      }
    }

    function invokeFireUp(k) {
      return injector(interfaces[k % modules.length])
        .then(function (module) {
          module = removeCounters(module);
          expect(module).toEqual(modules[k % modules.length]);
        });
    }

    for ( var k = 0; k < 100; k+=1 ) {
      instantiationPromises[k] = invokeFireUp(k);
    }

    BPromise.all(instantiationPromises)
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should be independent for multiple injectors and with dependent modules and submodules', function (done) {

    var injectors = [];

    var customModule = {
      implements: 'injection/direct/singleDependencyAsString/customModule',
      inject: 'interfaces/unnested/singleAsString',
      factory: function (singleAsString) {
        return [singleAsString];
      }
    };

    for ( var i = 0; i < 100; i+=1 ) {
      injectors[i] = fireUpLib.newInjector({
        basePath: __dirname,
        modules: [
          '../fixtures/modules/interfaces/**/*.js',
          '!../fixtures/modules/interfaces/conflicts/*.js',
          '../fixtures/modules/injection/direct/*.js',
          '../fixtures/modules/injection/cascading/*.js',
          customModule
        ]
      });
    }

    var folderInjection = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/injection/direct/'));
    var folderInterfaces = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/'));

    var expectedModule = [
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
      path.join(folderInterfaces, 'unnested/singleAsList.js')
    ];

    var instantiationPromises = [];

    function removeCounters(module) {
      if (_.isArray(module)) {
        if (module.length === 2 && _.isString(module[0]) && _.isNumber(module[1])) {
          return module[0];
        } else {
          return _.map(module, removeCounters);
        }
      } else {
        return module;
      }
    }

    function invokeFireUp(k) {
      return injectors[k]('injection/cascading/injectAllDirect')
        .then(function (module) {
          module = removeCounters(module);
          expect(module).toEqual(expectedModule);
        });
    }

    for ( var k = 0; k < 100; k+=1 ) {
      instantiationPromises[k] = invokeFireUp(k);
    }

    BPromise.all(instantiationPromises)
      .then(function () {
        done();
      })
      .catch(done);

  });

  it('should be independent for one injector and with dependent modules and submodules', function (done) {

    var injector = fireUpLib.newInjector({
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

    var expectedModule = [
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
      path.join(folderInterfaces, 'unnested/singleAsList.js')
    ];

    var instantiationPromises = [];

    function removeCounters(module) {
      if (_.isArray(module)) {
        if (module.length === 2 && _.isString(module[0]) && _.isNumber(module[1])) {
          return module[0];
        } else {
          return _.map(module, removeCounters);
        }
      } else {
        return module;
      }
    }

    function invokeFireUp(k) {
      return injector('injection/cascading/injectAllDirect')
        .then(function (module) {
          module = removeCounters(module);
          expect(module).toEqual(expectedModule);
        });
    }

    for ( var k = 0; k < 100; k+=1 ) {
      instantiationPromises[k] = invokeFireUp(k);
    }

    BPromise.all(instantiationPromises)
      .then(function () {
        done();
      })
      .catch(done);

  });

});
