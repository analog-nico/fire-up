'use strict';

// Fire me up!

module.exports = {
  implements: 'expressApp',
  inject: ['require(bluebird)', 'require(express)', 'config', 'routes']
};

module.exports.factory = function(Promise, express, config, routes) {

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
