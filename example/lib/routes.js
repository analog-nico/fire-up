'use strict';

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
