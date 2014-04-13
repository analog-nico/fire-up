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

    expect(fireUp._internal.registry.modules[filePathToLoad].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[filePathToIgnore].status).toBe(fireUp.constants.FILE_STATUS_TO_IGNORE);

    expect(_.isFunction(fireUp._internal.registry.modules[filePathToLoad].cache.module)).toBe(true);

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

    expect(fireUp._internal.registry.modules[pathSingleAsStringJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSingleAsListJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathMultipleJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);

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

    expect(fireUp._internal.registry.modules[pathBaseAndSubInterfaceJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathBaseInterface1Js].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathBaseInterface2Js].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterface1Js].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterface2Js].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterfaceWithoutBase1Js].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubInterfaceWithoutBase2Js].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubSubInterfaceOfBaseInterfaceJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubSubInterfaceOfSubInterfaceJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);
    expect(fireUp._internal.registry.modules[pathSubSubInterfaceWithoutBaseJs].status).toBe(fireUp.constants.FILE_STATUS_REGISTERED);

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

  it('should validate the modules', function (done) {

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/crashesOnLoad.js']
    }); }).toThrowOfType(fireUpLib.errors.ModuleLoadingError);


    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/notAFactory.js']
    }); }).toThrowOfType(fireUpLib.errors.ConfigError);

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname,
      modules: ['../fixtures/modules/wrongConfig/noModuleConfig.js']
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

    done();

  });

});
