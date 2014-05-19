'use strict';

var fireUpLib = require('../lib/index.js');

try {

  var fireUp = fireUpLib.newInjector({
    basePath: __dirname,
    modules: ['./lib/**/*.js', './plugins/**/*.js']
  });

} catch (e) {
  console.error(e);
  process.exit(1);
}

fireUp('expressApp', { use: ['routes:extendable'] })
  .then(function(expressApp) {
    console.log('App initialized');
    if (process.send) { process.send('running'); } // Used for automated test for this example.
  }).catch(function (e) {
    console.error(e);
    process.exit(1);
  });
