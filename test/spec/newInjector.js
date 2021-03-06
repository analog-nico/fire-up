'use strict';

describe("Regarding its instantiation, FireUp", function () {

  var _ = require('lodash');
  var path = require('path');
  var matchers = require('../matchers.js');

  var fireUpLib = require('../../lib/index.js');

  var minimalOptions = {
    basePath: __dirname,
    modules: ['test']
  };


  beforeEach(function () {
    this.addMatchers(matchers);
  });


  it('should provide a newInjector function', function (done) {

    expect(_.isFunction(fireUpLib.newInjector)).toBe(true);
    expect(_.isFunction(fireUpLib.newInjector(minimalOptions))).toBe(true);

    done();

  });

  it('should validate the options for a new injector', function (done) {

    expect(function () { fireUpLib.newInjector();               }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector(false);          }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector(1);              }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector(null);           }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector(function () {}); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({});             }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector(minimalOptions); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      modules: ['test']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: null
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: 42
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: function () {}
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: ''
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: 'unknown'
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: __dirname
    }); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: null
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: 42
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: []
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: [true]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test', 42]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: [{
        implements: 'custom',
        factory: function () {}
      }, 42]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test1', 'test2']
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test1', 'test2', {
        implements: 'custom',
        factory: function () {}
      }]
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: [{
        implements: 'custom',
        factory: function () {}
      }]
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: [{
        implements: 'custom',
        factory: function () {}
      },
      {
        implements: 'custom2',
        factory: function () {}
      }]
    }); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: null
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: 42
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: []
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: [true]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: ['test:mock', 42]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: ['test:mock', 'test']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: ['test:mock', 'te st']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: ['test:mock', 'test()']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: ['test:mock', 'test:mock2']
    }); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], bustRequireCache: 42
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], bustRequireCache: true
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], bustRequireCache: false
    }); }).not.toThrow();

    done();

  });

  it('should register a module with // Fire me up!', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/simple/**/*.js']
    });

    var filePathToLoad = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/simple/simple.js'));
    var filePathToIgnore = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/simple/notToFireUp.js'));

    expect(_.isPlainObject(fireUp._internal.registry.modules[filePathToLoad])).toBe(true);
    expect(_.isPlainObject(fireUp._internal.registry.modules[filePathToIgnore])).toBe(true);

    expect(fireUp._internal.registry.modules[filePathToLoad].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[filePathToIgnore].status).toBe(fireUp.constants.MODULE_STATUS_TO_IGNORE);

    expect(_.isFunction(fireUp._internal.registry.modules[filePathToLoad].cache.module.factory)).toBe(true);

    expect(fireUp._internal.registry.interfaces['simple'].file).toEqual(filePathToLoad);

    done();

  });

  it('should register unnested interfaces', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/unnested/*.js']
    });

    var moduleFolder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/unnested/'));
    var pathSingleAsStringJs = path.join(moduleFolder, 'singleAsString.js');
    var pathSingleAsListJs = path.join(moduleFolder, 'singleAsList.js');
    var pathMultipleJs = path.join(moduleFolder, 'multiple.js');

    expect(fireUp._internal.registry.modules[pathSingleAsStringJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSingleAsListJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathMultipleJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);

    expect(fireUp._internal.registry.interfaces['interfaces/unnested/singleAsString'].file).toEqual(pathSingleAsStringJs);
    expect(fireUp._internal.registry.interfaces['interfaces/unnested/singleAsList'].file).toEqual(pathSingleAsListJs);
    expect(fireUp._internal.registry.interfaces['interfaces/unnested/multiple1'].file).toEqual(pathMultipleJs);
    expect(fireUp._internal.registry.interfaces['interfaces/unnested/multiple2'].file).toEqual(pathMultipleJs);

    done();

  });

  it('should register nested interfaces', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/nested/*.js']
    });

    var moduleFolder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/interfaces/nested/'));
    var pathBaseAndSubInterfaceJs = path.join(moduleFolder, 'baseAndSubInterface.js');
    var pathBaseInterface1Js = path.join(moduleFolder, 'baseInterface1.js');
    var pathBaseInterface2Js = path.join(moduleFolder, 'baseInterface2.js');
    var pathSubInterface1Js = path.join(moduleFolder, 'subInterface1.js');
    var pathSubInterface2Js = path.join(moduleFolder, 'subInterface2.js');
    var pathSubInterfaceWithoutBase1Js = path.join(moduleFolder, 'subInterfaceWithoutBase1.js');
    var pathSubInterfaceWithoutBase2Js = path.join(moduleFolder, 'subInterfaceWithoutBase2.js');
    var pathSubSubInterfaceOfBaseInterfaceJs = path.join(moduleFolder, 'subSubInterfaceOfBaseInterface.js');
    var pathSubSubInterfaceOfSubInterfaceJs = path.join(moduleFolder, 'subSubInterfaceOfSubInterface.js');
    var pathSubSubInterfaceWithoutBaseJs = path.join(moduleFolder, 'subSubInterfaceWithoutBase.js');

    expect(fireUp._internal.registry.modules[pathBaseAndSubInterfaceJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathBaseInterface1Js].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathBaseInterface2Js].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterface1Js].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterface2Js].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterfaceWithoutBase1Js].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterfaceWithoutBase2Js].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubSubInterfaceOfBaseInterfaceJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubSubInterfaceOfSubInterfaceJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubSubInterfaceWithoutBaseJs].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface1'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface1'].interfaces['subInterface'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface2'].interfaces['subInterface'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface2'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface3'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface3'].interfaces['subInterface'].interfaces['subInterface'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface4'].interfaces['subInterface'].interfaces['subInterface'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface4'].file).toEqual(pathBaseAndSubInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface3'].interfaces['subInterface'].file).toBe(null);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface4'].interfaces['subInterface'].file).toBe(null);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].file).toEqual(pathBaseInterface1Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface2'].file).toEqual(pathBaseInterface2Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].interfaces['subInterface1'].file).toEqual(pathSubInterface1Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].interfaces['subInterface2'].file).toEqual(pathSubInterface2Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface1'].interfaces['subInterface1'].file).toEqual(pathSubInterfaceWithoutBase1Js);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface1'].file).toBe(null);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface1'].interfaces['subInterface2'].file).toEqual(pathSubInterfaceWithoutBase2Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface2'].interfaces['subInterface'].interfaces['subSubInterface'].file).toEqual(pathSubSubInterfaceOfBaseInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface2'].interfaces['subInterface'].file).toBe(null);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].interfaces['subInterface1'].interfaces['subSubInterface'].file).toEqual(pathSubSubInterfaceOfSubInterfaceJs);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface2'].interfaces['subInterface'].interfaces['subInterface'].file).toEqual(pathSubSubInterfaceWithoutBaseJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface2'].interfaces['subInterface'].file).toBe(null);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface2'].file).toBe(null);

    done();

  });

  it('should register custom modules', function (done) {

    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: [{
        implements: 'custom/module1',
        factory: function () { return 'module1'; }
      },
        {
          implements: 'custom/module2:sub',
          factory: function () { return 'module2'; }
        },
        {
          implements: ['custom/module3', 'custom/module3:sub'],
          factory: function () { return 'module3'; }
        }]
    });

    var registryIdModule1 = fireUp._internal.registry.interfaces['custom/module1'].file;
    var registryIdModule2Sub = fireUp._internal.registry.interfaces['custom/module2'].interfaces['sub'].file;
    var registryIdModule3 = fireUp._internal.registry.interfaces['custom/module3'].file;
    var registryIdModule3Sub = fireUp._internal.registry.interfaces['custom/module3'].interfaces['sub'].file;

    expect(registryIdModule3).toEqual(registryIdModule3Sub);

    expect(fireUp._internal.registry.modules[registryIdModule1].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[registryIdModule2Sub].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[registryIdModule3].status).toBe(fireUp.constants.MODULE_STATUS_REGISTERED);

    expect(fireUp._internal.registry.modules[registryIdModule1].cache.module.factory()).toEqual('module1');
    expect(fireUp._internal.registry.modules[registryIdModule2Sub].cache.module.factory()).toEqual('module2');
    expect(fireUp._internal.registry.modules[registryIdModule3].cache.module.factory()).toEqual('module3');

    done();

  });

  it('should validate the modules', function (done) {

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/crashesOnLoad.js']
    }); }).toThrowOfType(fireUpLib.errors.ModuleLoadingError);


    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/noFactory.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/factoryAndConstructor.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/factoryAndInstance.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/constructorAndInstance.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/factoryAndConstructorAndInstance.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/notAFactory.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/notAConstructor.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/thenableInstance.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/thenableConstructor.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);


    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/wrongModuleConfig.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/emptyModuleConfig.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/implementsNotAString.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/implementsNotAllStrings.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/implementsWithStaticArgsAsString.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/implementsWithStaticArgsAsArray.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/implementsContainsDuplicates.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);


    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectConfigWrongType.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectInvalidRefAsString.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectInvalidRefAsArray.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectEmptyRefAsString.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectEmptyRefAsArray.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/invalidStarPatternReference.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/instanceWithInject.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);


    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/typeConfigWrongType.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/typeConfigUnknown.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);


    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectOwnInterface1.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/injectOwnInterface2.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    done();

  });

  it('should validate custom modules', function (done) {

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: [{}]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: [{ implements: 'custom' }]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: [{ implements: 'custom', factory: function () {} }]
    }); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: [{ implements: 'custom', factory: function () {} }, {}]
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    done();

  });

  it('should be able to register non-factory modules in multiple injectors', function () {

    var injector1, injector2;
    var moduleFolder = path.relative(process.cwd(), path.join(__dirname, '../fixtures/modules/instantiation/factoryAdapters/'));

    expect(function () { injector1 = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/factoryAdapters/*.js']
    }); }).not.toThrow();

    expect(injector1._internal.registry.modules[path.join(moduleFolder, 'instance.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);
    expect(injector1._internal.registry.modules[path.join(moduleFolder, 'instanceMultiple.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);
    expect(injector1._internal.registry.modules[path.join(moduleFolder, 'constructor.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);
    expect(injector1._internal.registry.modules[path.join(moduleFolder, 'constructorMultiple.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);

    expect(function () { injector2 = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/instantiation/factoryAdapters/*.js']
    }); }).not.toThrow();

    expect(injector2._internal.registry.modules[path.join(moduleFolder, 'instance.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);
    expect(injector2._internal.registry.modules[path.join(moduleFolder, 'instanceMultiple.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);
    expect(injector2._internal.registry.modules[path.join(moduleFolder, 'constructor.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);
    expect(injector2._internal.registry.modules[path.join(moduleFolder, 'constructorMultiple.js')].status).toBe(fireUpLib.constants.MODULE_STATUS_REGISTERED);

  });

  it('should throw conflicts when registering interfaces', function (done) {

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/conflicts/implementingSameInterface{1,2}.js']
    }); }).toThrowOfType(fireUpLib.errors.InterfaceRegistrationConflictError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/conflicts/implementingSameInterface1.js', {
        implements: ['interfaces/conflicts/implementingSameInterface'],
        factory: function () {}
      }]
    }); }).toThrowOfType(fireUpLib.errors.InterfaceRegistrationConflictError);

    // Use internal calls to force more than two conflicting files.
    var fireUp = fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/interfaces/conflicts/implementingSameInterface1.js']
    });
    expect(function () {
      fireUp._internal.registry.registerInterface('test/fixtures/modules/interfaces/conflicts/implementingSameInterface2.js', 'interfaces/conflicts/implementingSameInterface');
    }).toThrowOfType(fireUpLib.errors.InterfaceRegistrationConflictError);
    expect(function () {
      fireUp._internal.registry.registerInterface('test/fixtures/modules/interfaces/conflicts/implementingSameInterface3.js', 'interfaces/conflicts/implementingSameInterface');
    }).toThrowOfType(fireUpLib.errors.InterfaceRegistrationConflictError);

    done();

  });

});
