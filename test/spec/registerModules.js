'use strict';

describe('Regarding module registration, FireUp', function () {

  var _ = require('lodash');
  var path = require('path');

  var fireUpLib = require('../../lib/index.js');

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
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface3'].interfaces['subInterface'].file).not.toBeDefined();
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseAndSubInterface4'].interfaces['subInterface'].file).not.toBeDefined();

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].file).toEqual(pathBaseInterface1Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface2'].file).toEqual(pathBaseInterface2Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].interfaces['subInterface1'].file).toEqual(pathSubInterface1Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].interfaces['subInterface2'].file).toEqual(pathSubInterface2Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface1'].interfaces['subInterface1'].file).toEqual(pathSubInterfaceWithoutBase1Js);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface1'].file).not.toBeDefined();

    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface1'].interfaces['subInterface2'].file).toEqual(pathSubInterfaceWithoutBase2Js);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface2'].interfaces['subInterface'].interfaces['subSubInterface'].file).toEqual(pathSubSubInterfaceOfBaseInterfaceJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface2'].interfaces['subInterface'].file).not.toBeDefined();

    expect(fireUp._internal.registry.interfaces['interfaces/nested/baseInterface1'].interfaces['subInterface1'].interfaces['subSubInterface'].file).toEqual(pathSubSubInterfaceOfSubInterfaceJs);

    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface2'].interfaces['subInterface'].interfaces['subInterface'].file).toEqual(pathSubSubInterfaceWithoutBaseJs);
    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface2'].interfaces['subInterface'].file).not.toBeDefined();
    expect(fireUp._internal.registry.interfaces['interfaces/nested/noBaseInterface2'].file).not.toBeDefined();

    done();

  });

});
