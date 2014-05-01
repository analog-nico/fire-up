'use strict';

// Fire me up!

module.exports = {
  implements: 'routes'
};

module.exports.factory = function () {

  var message = 'Hello World';

  function register(app) {
    app.get('/', function(req, res){
      res.send(message);
    });
  }

  return { register: register };

};
