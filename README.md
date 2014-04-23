# Fire Up! Dependency Injector

[![Build Status](https://travis-ci.org/analog-nico/fire-up.svg?branch=master)](https://travis-ci.org/analog-nico/fire-up) [![Coverage Status](https://coveralls.io/repos/analog-nico/fire-up/badge.png?branch=master)](https://coveralls.io/r/analog-nico/fire-up?branch=master) [![Dependencies up to date](https://david-dm.org/analog-nico/fire-up.png)](https://david-dm.org/analog-nico/fire-up)

Fire Up! is a dependency injection container specifically designed for node.js with a powerful but sleek API.

## What you can expect

- Fire Up! has a well designed API that allows you to get rid of any hardcoded require call.
- A module requires minimal boilerplate code and remains highly maintainable.
- You may choose to initialize your modules by easily injecting specific implementations for more general interfaces. E.g. replace a socket by a secure socket.
- You can implement your automated tests by easily injecting your mocks and spies.
- Fire Up! is a functional and robust library with very high test coverage far beyond the 100% a test coverage tool can measure.
- If you configure something wrong you will always get a helpful error message.

## Why I decided to write my own dependency injector

I was prepping for a new project that aimed to support [continuous deployment](http://puppetlabs.com/blog/continuous-delivery-vs-continuous-deployment-whats-diff). So fully automated testing is a must. However, my ambitions would soon falter by paralyzing bad testability without proper dependency injection. ([quick](http://csausdev.wordpress.com/2010/12/17/dependency-injection-in-node-js/) / [sophisticated](https://www.youtube.com/watch?v=JjqKQ8ezwKQ) explanation)

Arguments forthcoming.

Great inspiration came from the [existing di containers](http://www.mariocasciaro.me/dependency-injection-in-node-js-and-other-architectural-patterns) and the [mastermind of AngaularJS' dependency injector](https://www.youtube.com/watch?v=_OGGsf1ZXMs).

## Installation

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

### app.js - Main module  that starts up the express server

`app.js` is the main module that will be instatiated by `server_fireup.js` by using the API of Fire Up! This means the module has to conform to the Fire Up! module pattern:

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

(BTW, you can also use another [Promises/A+ compliant](http://promisesaplus.com) library if you prefer.)

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

Note that the factory method returns a function. That function is the actual module instance injected into `app.js`. Consequently that function can be called in `app.js`:

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
var fireUpLib = require('fire-up');     // Should be the only require call you will ever need again.

try {

  var fireUp = fireUpLib.newInjector({  // Sets up the injector
    basePath: __dirname,                // Used to relate the paths given in modules
    modules: ['./lib/**/*.js']          // Where to look for Fire Up! modules
  });

} catch (e) {
  console.error(e);                     // If something went wrong here this means the developer configured something wrong.
  process.exit(1);                      // The console output will always give you helpful details.
}

fireUp('expressApp')                    // FIRES UP THE WHOLE THING. The argument denotes the interface implemented by app.js.
  .then(function(expressApp) {
    console.log('App initialized');     // If the initialization finished successfully the returned promise is resolved.
  }).catch(function (e) {
    console.error(e);                   // If something went wrong here this could either mean that the developer configured
    process.exit(1);                    // something wrong or the module code inside the factory method failed. In the latter
  });                                   // case a fireUp.errors.InstanceInitializationError is returned that wraps the causing
                                        // error. Again, the console output will always give you helpful details.
```

## What you should know about Fire Up!'s own dependencies

**The promises returned by `fireUp(...)`** are implemented by [bluebird](https://www.npmjs.org/package/bluebird). Nonetheless you may choose to use a different promise library in your modules e.g. to initialize them asynchronously. Any [Promises/A+ compliant](http://promisesaplus.com) library should work. Successful [tests](https://github.com/analog-nico/fire-up/blob/master/test/spec/promises.js) for [rsvp](https://www.npmjs.org/package/rsvp) and [when](https://www.npmjs.org/package/when) exist.

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