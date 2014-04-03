'use strict';

describe("Regarding its instantiation, FireUp", function () {

  var _ = require('lodash');

  var fireUpLib = require('../../lib/index.js');

  var minimalOptions = {
    basePath: __dirname,
    include: ['test']
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
      include: ['test']
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      include: ['test'], basePath: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      include: ['test'], basePath: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      include: ['test'], basePath: function () {}
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      include: ['test'], basePath: ''
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      include: ['test'], basePath: 'unknown'
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      include: ['test'], basePath: __dirname
    }); }).not.toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: []
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: [true]
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test', 42]
    }); }).toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: []
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: [true]
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: ['test', 42]
    }); }).toThrow();

    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: ['test'], use: null
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: ['test'], use: 42
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: ['test'], use: []
    }); }).not.toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: ['test'], use: [true]
    }); }).toThrow();
    expect(function () { fireUpLib.newInjector({
      basePath: __dirname, include: ['test'], exclude: ['test'], use: ['test', 42]
    }); }).toThrow();

    done();

  });

});
