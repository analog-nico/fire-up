# Fire Up! Dependency Injector

[![Build Status](https://travis-ci.org/analog-nico/fire-up.svg?branch=master)](https://travis-ci.org/analog-nico/fire-up) [![Coverage Status](https://coveralls.io/repos/analog-nico/fire-up/badge.png?branch=master)](https://coveralls.io/r/analog-nico/fire-up?branch=master) [![Dependencies up to date](https://david-dm.org/analog-nico/fire-up.png)](https://david-dm.org/analog-nico/fire-up)

Fire Up! is a dependency injection container designed specifically for node.js with a powerful but sleek API.

## What you can expect

- Fire Up! has a well designed API that allows you to get rid of any hardcoded require call.
- A module requires minimal boilerplate code and remains highly maintainable.
- You can easily implement and inject decorators / wrappers. E.g. replace a socket by a secure socket.
- You can implement your automated tests by easily injecting your mocks and spies.
- Fire Up! is a functional and robust library with very high test coverage far beyond the 100% a test coverage tool can measure.
- If you configure something wrong you will always get a helpful error message.

However, do not expect:

- Aspect-oriented programming

## Why I decided to write my own dependency injector

In March 2014 I was prepping for a new project that aims for [continuous deployment](http://puppetlabs.com/blog/continuous-delivery-vs-continuous-deployment-whats-diff). Without proper dependency injection, however, I would have a hard time to implement fully automated tests. ([quick](http://csausdev.wordpress.com/2010/12/17/dependency-injection-in-node-js/) / [sophisticated](https://www.youtube.com/watch?v=JjqKQ8ezwKQ) elaboration) When I searched for dependency injection (di) containers for node.js I was surprised by the difficult choice to make. There are plenty of di containers that are still used by only a few people or some more widely adopted ones which are, however, designed to work in the browser as well / primarily. In my opinion there is a fundamental difference if you design a di container for node.js compared to one for the browser: In the browser you cannot require just all module source files regardless of whether you later need them for injection or not. Someone browsing your site on a slow internet connection will just get sad. In node.js, though, this is not an issue. Thus you can make the module registration phase a lot easier for the developers. Thinking about a large application it will make a difference in the maintenance required. So what I needed was a di container designed specifically for node.js.

If you are currently looking for the right di container for your own new project you may go through the same pain as I did. If you happen to choose the wrong di container and realize you have to switch to another one a year later you will face a huge refactoring task. So you want to choose wisely. At the time I was looking for a di container none of the available ones met enough of my requirements at once:

- Ideally a sound user base which indicates that the di container has matured and the code base is still maintained
- A well designed and simple API
- Each source file should represent a module and does not need extra configuration files sprinkled across my project
- Helpful documentation
- Helpful debug output if the injection does not work as intended (This is were Fire Up! really stands out.)

I have to admit by implementing my own dependency injector I have the advantage that I don't need helpful documentation and don't have to worry about continued maintenance. Anyhow, I hope that Fire Up! will gradually meet all those requirements and it will become an easy choice for you to use it in your own project. However, if you are not convinced I can recommend [a great article on di containers for node.js](http://www.mariocasciaro.me/dependency-injection-in-node-js-and-other-architectural-patterns) to you that helped me choosing one and later to get inspiration for the design of Fire Up! If you want to dig deeper into the design of a di container you have to watch the [impressive talk](https://www.youtube.com/watch?v=_OGGsf1ZXMs) of the mastermind of AngularJS' dependency injector.

## Installation

[![NPM Stats](https://nodei.co/npm/fire-up.png?downloads=true)](https://npmjs.org/package/fire-up)

This module is installed via npm:

``` bash
$ npm install fire-up
```

## Getting Started

Let us assume you want to implement a simple express server [as explained on howtonode.org](http://howtonode.org/getting-started-with-express) (using outdated API though) with the following (updated) code and **no Fire Up! flavored dependency injection yet**:

``` js
var express = require('express'),
    logger = require('morgan'),
    app = express();

app.use(logger());

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(3000, function () {
  console.log('Express server started on port 3000');
});
```

Since dependency injection is meant for large applications we think this example app a little bigger and split it up into three modules:

```
-- example
   |-- lib
   |   |-- app.js        // Main module that starts up the express server
   |   |-- config.js     // Config module that configures the express app
   |   |-- routes.js     // Module that sets up the routes of the express app
   |-- server_fireup.js  // Main script to run from node and which invokes Fire Up!
```

(You can find all sources shown below in the [repo](https://github.com/analog-nico/fire-up/tree/master/example).)

### app.js - Main module  that starts up the express server

`app.js` is the main module that will be instantiated by `server_fireup.js` by using the API of Fire Up! This means the module has to conform to the Fire Up! module pattern:

``` js
// Fire me up!

module.exports = function(Promise, express, config, routes) {

  // The module code goes here.

};

module.exports.__module = {
  implements: 'expressApp',
  inject: ['require(bluebird)', 'require(express)', 'config', 'routes']
};
```

The module must export a function that takes the injected dependencies as parameters and returns an instance of the module. (**Factory pattern**) Secondly, the module must export a `__module` property that states the interface it provides through `implements` and references the dependencies to be injected through `inject`. Finally, the code must contain the `// Fire me up!` comment to announce the source file as a Fire Up! module.

The module code inside the factory method looks like this:

``` js
module.exports = function(Promise, express, config, routes) {

  var app = express();

  config(app);
  routes.register(app);

  app.listen(3000, function () {
    console.log('Express server started on port 3000');
  });

  return app;

};
```

However, if we write the code like this the returned module instance - which is `app`- is not fully initialized at the time we return it. To appropriately wait for the asynchronous operation `app.listen(...)` to finish we have to create a promise and return it instead. Fire Up! will wait until the promise is resolved.

The **final module code** looks like this:

``` js
// Fire me up!

module.exports = function(Promise, express, config, routes) {

  return new Promise(function (resolve) {

    var app = express();

    config(app);
    routes.register(app);

    app.listen(3000, function () {
      console.log('Express server started on port 3000');
      resolve(app);
    });

  });

};

module.exports.__module = {
  implements: 'expressApp',
  inject: ['require(bluebird)', 'require(express)', 'config', 'routes']
};
```

(BTW, instead of [bluebird](https://github.com/petkaantonov/bluebird) you can also use another [Promises/A+ compliant](http://promisesaplus.com) library if you prefer.)

### config.js - Config module that configures the express app

`app.js` declares its dependency to the interface `config` through:

``` js
// app.js
module.exports.__module = {
  // ...
  inject: [ /* ... */  'config'  /* ... */ ]
};
```

`config.js` implements the interface `config` and thus has to state:
``` js
// config.js
module.exports.__module = {
  implements: 'config'
  // ...
};
```

The **complete module code** of `config.js` looks like this:

``` js
// Fire me up!

module.exports = function (logger) {

  return function (app) {
    app.use(logger());
    // ... and more config / adding middleware etc.
  };

};

module.exports.__module = {
  implements: 'config',
  inject: ['require(morgan)']
};
```

Note that the factory method returns a function. That function is the actual module instance injected into `app.js`. Consequently that function can be called in the factory method of `app.js`:

``` js
// app.js
module.exports = function( /* ... */  config  /* ... */ ) {

  // ...

  // typeof config -> 'function'
  config(app);

  // ...

};
```

### routes.js - Module that sets up the routes of the express app

There is not much to say about `routes.js` except that is a good example for using the factory method according to the [module pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#modulepatternjavascript) where `message` is a private variable:

``` js
// Fire me up!

module.exports = function () {

  var message = 'Hello World';

  function register(app) {
    app.get('/', function(req, res){
      res.send(message);
    });
  }

  return { register: register };

};

module.exports.__module = {
  implements: 'routes'
};
```

### server_fireup.js - Main script to run from node and which invokes Fire Up!

The three modules above represent the complete express server logic. We now only need some code to fire the whole thing up! For that Fire Up! has two API methods which we use like this:

``` js
var fireUpLib = require('fire-up');     // Should be the only require call you'll ever need again.

try {

  var fireUp = fireUpLib.newInjector({  // Sets up the injector
    basePath: __dirname,                // Used to relate the paths given in modules
    modules: ['./lib/**/*.js']          // Where to look for Fire Up! modules
  });

} catch (e) {
  console.error(e);                     // If something went wrong here this means the developer
  process.exit(1);                      // configured something wrong. The console output will
}                                       // always give you helpful details.

                                        // FIRES UP THE WHOLE THING. The argument denotes the
fireUp('expressApp')                    // interface implemented by app.js.
  .then(function(expressApp) {
                                        // If the initialization finished successfully the
    console.log('App initialized');     // returned promise is resolved.

  }).catch(function (e) {               // If something went wrong here this could either mean
                                        // that the developer configured something wrong or the
    console.error(e);                   // module code inside the factory method failed. In the
    process.exit(1);                    // latter case a fireUp.errors.InstanceInitializationError
                                        // is returned that wraps the causing error. Again, the
  });                                   // console output will always give you helpful details.
```

To run the server type `node server_fireup.js` into the shell.

The console output will the injected dependencies as a tree:

```
fireUp# INFO  Requested: expressApp, implemented in: example/lib/app.js
fireUp# INFO  |-- Requested: require(bluebird)
fireUp# INFO  |-- Requested: require(express)
fireUp# INFO  |-- Requested: config, implemented in: example/lib/config.js
fireUp# INFO      |-- Requested: require(morgan)
fireUp# INFO  |-- Requested: routes, implemented in: example/lib/routes.js
```

### Switching implementations, e.g. to introduce a mock for testing

Dependency injection is for loose coupling. And loose coupling is only loose if you can easily switch the implementation that is used for injection. The most common use case is to replace a module by a mock during testing. Regarding our example let us say we want to replace the `routes.js` module by a mock. The mock, of course, has to implement the same interface as the original `routes.js` module does. Otherwise the mock would not be compatible. Additionally, the mock would also implement some extra feature that are needed for testing. Thus the interface the mock implements is an extended version of the interface implemented by the `routes.js` module.

Fire Up! got the concept of interface hierarchies baked into it. As the `routes.js` module `implements: 'routes'` the mock module in the source file `./test/fixtures/routes_mock.js` will `implement: 'routes:mock'`. The colon `:` denotes the extension of an interface. Since the interface `routes:mock` must be fully compatible with the interface `routes` (however, not vice versa) any module that requests an implementation of the interface `routes` will be also be happy to get an implementation of the interface `routes:mock` injected.

The implementation of `./test/fixtures/routes_mock.js` looks like this:

``` js
// Fire me up!

module.exports = function () {                // Make sure this implementation is compatible with
                                              // the routes interface implemented by routes.js.
  var message = 'You are mocking me!';

  function register(app) {
    app.get('/easter', function (req, res) {
      res.send('egg')
    });
    app.get('/', function(req, res){
      res.send(message);
    });
  }

  return { register: register };              // Turns out it is compatible. ;)

};

module.exports.__module = {
  implements: 'routes:mock'                   // Declares the extended interface. That's all.
};
```

(Of course this mock would make more sense if the original `routes.js` module would do something more sophisticated like responding with data from a database.)

The test code in the source file `./test/server_fireup_test.js` will fire the mocked express server up like this:

``` js
var fireUpLib = require('fire-up');

try {

  var fireUp = fireUpLib.newInjector({
    basePath: __dirname,
    modules: [
      '../lib/**/*.js',                         // Extend the search paths so that the mock gets
      './fixtures/**/*.js'                      // available for injection.
    ]
  });

} catch (e) {
  console.error(e);
  process.exit(1);
}

fireUp('expressApp', { use: ['routes:mock'] })  // The 'use' option tells Fire Up! to use the
  .then(function(expressApp) {                  // the implementation for 'routes:mock' for all
    console.log('App initialized');             // compatible interfaces. In this case these
  }).catch(function (e) {                       // are: 'routes' and 'routes:mock'
    console.error(e);
    process.exit(1);
  });
```

To run the mocked server type `node ./test/server_fireup_test.js` into the shell.

The console output will now show that the mock is injected (see last line):

```
fireUp# INFO  Requested: expressApp, implemented in: example/lib/app.js
fireUp# INFO  |-- Requested: require(bluebird)
fireUp# INFO  |-- Requested: require(express)
fireUp# INFO  |-- Requested: config, implemented in: example/lib/config.js
fireUp# INFO      |-- Requested: require(morgan)
fireUp# INFO  |-- Requested: routes, but using: routes:mock, implemented in: example/test/fixtures/routes_mock.js
```

## Recommended Application Architecture

When I designed Fire Up! I had a certain node.js application architecture in mind which I want to explain in this section. I tried to come up with a design that is as unopinionated as possible. If you ever used [backbone.js](http://backbonejs.org) you will know that it enforces some structure on your web app but is still very open to any direction your development is heading. Fire Up! can be considered as having a similar level of enforcement and openness.

Usually a node.js app is booted like this:

  1. If it is a server of some kind multiple node.js processes get started by [forever](https://github.com/nodejitsu/forever) or [pm2](https://github.com/unitech/pm2). Otherwise just one node.js process is started.
  2. In each node.js process the main js file requires all resources needed and initializes the app.
  3. The app enters the servicing phase after the initialization is completed.
  4. Depending on the app's functionality it initializes subcomponents as they are needed. E.g. establishing a sophisticated session when a user logs in.

With Fire Up! the boot process changes to:

  1. As usual, Node.js processes are started.
  2. In each node.js process the main js file requires Fire Up!, creates an injector, and fires up the main module. By using the injected dependencies the app initializes.
  3. As usual, the app enters the servicing phase.
  4. When needed, subcomponents are initialized by using the Fire Up! injector.

As expected from a dependency injection container the way to instantiate modules and components is changed (for the better) but no enforcement on the actual application logic exists. The described boot process assumes that all instantiation tasks are done through the injector. In particular, this means that `require` is not used anymore. Even though this is recommended it is not enforced to always create instances through Fire Up!

### Migrating your existing node.js app to Fire Up!

If you have a large node.js app that doesn't use a dependency injector yet or does use another one you certainly do not have the option to rewrite your whole app to use Fire Up! at once. Fortunately, Fire Up! does not enforce an all-or-nothing approach. You can just migrate a small area of your app and use an injector for instantiating the code in just that area. It is even possible that the migrated modules still use regular require calls.

If you use a hybrid approach where you just use Fire Up! for certain areas of your app you should, however, pay attention to the modules' singleton nature: In traditional node.js development you are used to getting a singleton instance of a module when you require it. Fire Up! retains that singleton nature per default. For that a Fire Up! injector has a cache which is filled with the object returned by the factory method of a Fire Up! module. Hence, those modules are only singleton within the scope of a single Fire Up! injector instance. If you create multiple Fire Up! injectors or require a Fire Up! module manually you will produce multiple instances of your module. A rule of thumb would be to never require a Fire Up! module manually and if you use multiple Fire Up! injectors make sure they cover distinct groups of the available Fire Up! modules.

## API

### fireUpLib.newInjector(options) -> fireUp

Overview:

``` js
var fireUpLib = require('fire-up');

try {

  var fireUp = fireUpLib.newInjector({
    basePath: __dirname,
    modules: [ '../lib/**/*.js' ]
  });

} catch (e) {
  console.error(e);
}
```

Description forthcoming.

### fireUp(moduleReference, [options] ) -> Promise

Overview:

``` js
fireUp('expressApp', { use: ['routes:mock'] })
  .then(function(expressApp) {
    console.log('App initialized');
  }).catch(function (e) {
    console.error(e);
  });
```

Description forthcoming.

### The Fire Up! module pattern

Overview:

``` js
// Fire me up!

module.exports = function(injectedDependency1, injectedDependency2) {

  // Initialize and return a new module instance or a promise

};

module.exports.__module = {
  implements: 'providedInterface',
  inject: ['dependency1', 'dependency2']
};
```

#### // Fire me up!

Even though you could diligently define in the options of `fireUpLib.newInjector(options)` each and every module file you want to include or exclude this will become very tedious. Therefore every module file must contain the `// Fire me up!` comment in a single line. Then, usually, only the main module folder to be included is provided in the options of `fireUpLib.newInjector(options)`. Fire Up! will check every file for the comment and only load those which contain it.

#### The factory method

A Fire Up! module must export a function that takes the injected dependencies and static arguments (see __module.inject section below) as arguments and return a new module instance.

The returned module instance can be anything - a simple type like a string, an array, an object, a function etc. If the new module instance needs to be initialized asynchronously a promise must be returned that will be resolved with the new module instance once its initialization is done. Only after the promise is resolved Fire Up! will inject the new module instance into other modules.

Asynchronous initialization by returning a [bluebird](https://github.com/petkaantonov/bluebird) promise is done like this:

``` js
// Fire me up!

module.exports = function(Promise, express, config, routes) {  // The factory method...

  return new Promise(function (resolve) {                      // ...returns a promise...

    var app = express();

    config(app);
    routes.register(app);

    app.listen(3000, function () {
      console.log('Express server started on port 3000');
      resolve(app);                                            // ...and resolves it with
    });                                                        // the new module instance.

  });

};

module.exports.__module = {
  implements: 'expressApp',
  inject: ['require(bluebird)', 'require(express)', 'config', 'routes']
};
```

Instead of [bluebird](https://github.com/petkaantonov/bluebird) you can also use another [Promises/A+ compliant](http://promisesaplus.com) library if you prefer. There are easy to read [tests for all major promise libraries](https://github.com/analog-nico/fire-up/blob/master/test/spec/promises.js) which apply them to initialize a module asynchronously.


#### __module.implements

**Takes either a string or an array of strings** to announce one or multiple interfaces the module implements.

An interface name may contain any character except `:`, `(`, and `)`:

``` js
'myInterface', 'my-interface'  // Name your interface whatever you like.
'api/rest/users'               // By convention you may use e.g. a slash to use namespaces.
```

Using camel case or slashes for namespaces etc. is just a convention you can apply as you like. Fire Up! matches implemented interfaces with module references defined in `__module.inject` with strict equality `===`.

You can declare extended interfaces by using the colon `:`:

``` js
'db:mongo', 'db:couch'         // For a module that requests the 'db' interface you could choose
                               // to either inject 'db:mongo' or 'db:couch'.

'api/rest/users:cached'        // This module could replace the one implementing 'api/rest/users'
                               // and adds caching to it.

'api/rest/users:cached:mock'   // Nest as many extended interfaces you want.
```

**Important rule for extended interfaces**: A module implementing an extended interface must be fully compatible with the module implementing the base interface. E.g. if a module requests `'api/rest/users'` through `__module.inject` it must work well together with the module implementing the interface `'api/rest/users'` as well as the module implementing the interface `'api/rest/users:cached'` without actually knowing which implementation was injected.

A common use case for extended interfaces are **decorators / wrappers**: For example the module implementing the extended interface `'api/rest/users:cached'`would get the module implementing the base interface `'api/rest/users'`injected and adds caching:

``` js
// Fire me up!

module.exports = function (users) {

  var cache = {};

  function getUser(username) {
    if (cache[username] === undefined) {
      cache[username] = users.getUser(username);
    }
    return cache[username];
  }

  return {
    getUser: getUser
    // TODO: Expose the whole API of users to ensure compatibility.
  };

};

module.exports.__module = {
  implements: 'api/rest/users:cached',
  inject: 'api/rest/users'
};
```

#### __module.inject

**Takes either a string or an array of strings** to announce which interfaces the module depends on and for which module instances will be injected by Fire Up! The order in this array corresponds to the order of the arguments of the factory method.

Usually you will list interface names following the notation as described above for the `__module.implements` property. In addition you can add so called **static arguments** which are passed as additional arguments to the factory method of the module being injected. The following notation is used for static arguments:

``` js
'myInterface(static arg)', "myInterface('static arg')", 'myInterface("static arg")'  // strings
'myInterface(42)', 'myInterface(3.14)'                                               // numbers
'myInterface(true)', 'myInterface(false)'                                            // booleans
'myInterface(static arg 1, static arg 2)'                                            // multiple
'myInterface(static arg 1, true, 42)'                                                // mixed
```

Unquoted strings get trimmed:

``` js
'myInterface( static arg 1, static arg 2 )' --> 'static arg 1', 'static arg 2'
```

A module that allows to be requested including static args must be of type `'multiple instances'` (see __module.type below) and looks like this:

``` js
// Fire me up!

module.exports = function(injectedDependency1, injectedDependency2, staticArg1, staticArg2) {

  // Initialize and return a new module instance

};

module.exports.__module = {
  implements: 'example/staticArg',
  inject: ['dependency1', 'dependency2'],
  type: 'multiple instances'
};
```

This module could be referenced through `'example/staticArg(foo, bar)'`. Since the module announces two dependencies Fire Up! will inject the dependencies as the first and second argument and pass `'foo'` as the third and `'bar'` as the fourth argument into the factory method. If you reference the module through `'example/staticArg(foo)'` the fourth argument will be `undefined`.

#### __module.type

A Fire Up! module can be either instantiated as a `'singleton'` (default) or as `'multiple instances'`.

The module type `'singleton'` mimics the familiar behavior of `require`. The first time a singleton module is requested for injection Fire Up! will call the factory method to instantiate an instance of the module. For all preceding injection requests the factory method is NOT called again but instead the cached module instance is used for injection.

To configure a module as `'singleton'` the following choices are available:

``` js
// No type attribute to use the default
module.exports.__module = {
  implements: 'mySingletonModule'
};

// Type attribute as string
module.exports.__module = {
  implements: 'mySingletonModule',
  type: 'singleton'
};

// Type attribute using the constant
module.exports.__module = {
  implements: 'mySingletonModule',
  type: require('fire-up').constants.MODULE_TYPE_SINGLETON
};
```

**Caution**: The module cache is managed by the injector. If you call `fireUpLib.newInstance(options)` multiple times to get multiple injectors those injectors will each have their own cache. In this case it is not guaranteed that for a certain module only a single instance will exist inside the node.js process. The separate injectors may instantiate their own module instances.

The module type `'multiple instances'` allows to inject a new module instance for each injection request. Thus Fire Up! won't use the module cache and instead call the factory method to get a new module instance every time.

To configure a module as `'multiple instances'` the following choices are available:

``` js
// Type attribute as string
module.exports.__module = {
  implements: 'myMultipleInstancesModule',
  type: 'multiple instances'
};

// Type attribute using the constant
module.exports.__module = {
  implements: 'myMultipleInstancesModule',
  type: require('fire-up').constants.MODULE_TYPE_MULTIPLE_INSTANCES
};
```

## Built-in Modules

The following interfaces are implemented by modules available out-of-the-box and can be requested by a module through its `__module.inject` property.

### require(id)

Even though a Fire Up! module still can use native require calls this is not recommended. To allow switching the required dependencies e.g. for unit testing these dependencies should be injected using the built-in `require(id)` module. The notation reproduces native require calls:

``` js
module.exports.__module = {
  implements: 'iUseRequire',
  inject: [
    'require("util")',             // Internal node.js module
    'require("express")',          // Module installed via npm
    'require("./helper.js")',      // Local JS file with './' prefix
    'require("../log/logger.js")'  // Local JS file with '../' prefix
  ]
};
```

The quotes inside the parenthesis can be omitted. E.g. `'require(../log/logger.js)'` works as well.

**Caution**: Due to technical restrictions the lookup of modules installed via npm may not use the [expected paths](http://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders). (This does not affect internal node.js modules like 'util' or local JS files like './helper.js'.) Internally, `require.main.require(id)` is used. Thus those paths are used as if the native require call would be done in the main JS file which was given to startup node.js. Unfortunately, the used main JS file may differ between development / testing e.g. with grunt and production. To ensure predictability before moving to production you should pass a fitting require function through the options of `fireUpLib.newInjector(options)` or `fireUp(moduleReference, options)` that will be used instead of `require.main.require(id)`:

``` js
var fireUpLib = require('fire-up');

var fireUp = fireUpLib.newInjector({
  basePath: __dirname,
  modules: [ '../lib/**/*.js' ],
  require: require                    // Passes the local require function
});

fireUp('expressApp', {
  require: require                    // Overwrites the require function for this fireUp call
});
```

### require:mock(id)

Not yet implemented.

### fireUp/currentInjector

Description forthcoming.

### fireUp/currentInjector:mock

Not yet implemented.

### fireUp/injectionRequest

Description forthcoming.

### fireUp/options

Description forthcoming.

## What you should know about Fire Up!'s own dependencies

**The promises returned by `fireUp(...)`** are implemented by [bluebird](https://www.npmjs.org/package/bluebird). Nonetheless you may choose to use a different promise library in your modules e.g. to initialize them asynchronously. Any [Promises/A+ compliant](http://promisesaplus.com) library should work. Successful [tests](https://github.com/analog-nico/fire-up/blob/master/test/spec/promises.js) for the npm packages [avow](https://www.npmjs.org/package/avow), [bluebird](https://www.npmjs.org/package/bluebird), [deferred](https://www.npmjs.org/package/deferred), [deferreds](https://www.npmjs.org/package/deferreds), [kew](https://www.npmjs.org/package/kew), [lie](https://www.npmjs.org/package/lie), [mpromise](https://www.npmjs.org/package/mpromise), [node-promise](https://www.npmjs.org/package/node-promise), [p-promise](https://www.npmjs.org/package/p-promise), [promise](https://www.npmjs.org/package/promise), [Q](https://www.npmjs.org/package/q), [rsvp](https://www.npmjs.org/package/rsvp), [vow](https://www.npmjs.org/package/vow) and [when](https://www.npmjs.org/package/when) exist.

**The logging** is implemented through simple console output meant for developers who get started using Fire Up! Before you move to production you should inject your own logging library like [bunyan](https://www.npmjs.org/package/bunyan) or [winston](https://www.npmjs.org/package/winston). However, the ability to inject your own logging library is not implemented yet. Please stay tuned for the update. (FYI, I will implement it similarly as done by the [Elasticsearch client library.](http://www.elasticsearch.org/guide/en/elasticsearch/client/javascript-api/current/logging.html#_using_a_library))

## Contributing

The whole point in making Fire Up! public is to let it grow strong through community involvement. So your feedback is highly welcome!

To set up your development environment:
  1. clone the repo to your desktop,
  2. in the shell `cd` to the main folder,
  3. hit `npm install`, and
  4. run `grunt test`.

`grunt test` watches all source files and if you save some changes it will lint the code and execute all tests. The test coverage report can be viewed from `./coverage/lcov-report/index.html`.

If you want to debug a test you should use `grunt jasmine_node_no_coverage` to run all tests once without obscuring the code by the test coverage instrumentation.

## Change History

- v0.1.1 (upcoming)
  - Improved robustness
  - Updated dependencies
- v0.1.0 (2014-04-23)
  - Initial Version

## License (MIT)

Copyright (c) analog-nico

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
