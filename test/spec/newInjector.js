'use strict';

describe("Regarding its instantiation, FireUp", function () {

  var _ = require('lodash');

  var fireUpLib = require('../../lib/index.js');

  var minimalOptions = {
    basePath: __dirname,
    modules: ['test']
  };


  it('should provide a newInjector function', function (done) {

    expect(_.isFunction(fireUpLib.newInjector)).toBe(true);
    expect(_.isFunction(fireUpLib.newInjector(minimalOptions))).toBe(true);

    done();

  });

  it('should validate the options for a new injector', function (done) {

    expect(function () { fireUpLib.newInjector();               }).toThrow();
    expect(function () { fireUpLib.newInjector(false);          }).toThrow();
    expect(function () { fireUpLib.newInjector(1);              }).toThrow();
    expect(function () { fireUpLib.newInjector(null);           }).toThrow();
    expect(function () { fireUpLib.newInjector(function () {}); }).toThrow();
    expect(function () { fireUpLib.newInjector({});             }).toThrow();
    expect(function () { fireUpLib.newInjector(minimalOptions); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      modules: ['test']
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: function () {}
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: ''
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: 'unknown'
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      modules: ['test'], basePath: __dirname
    }); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: []
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: [true]
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test', 42]
    }); }).toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: []
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: [true]
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, modules: ['test'], use: ['test', 42]
    }); }).toThrow();

    done();

  });

});
