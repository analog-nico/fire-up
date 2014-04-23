'use strict';

// Fire me up!

module.exports = function () {

  var message = 'You are mocking me!';

  function register(app) {
    app.get('/easter', function (req, res) {
      res.send('egg')
    });
    app.get('/', function(req, res){
      res.send(message);
    });
  }

  return { register: register };

};

module.exports.__module = {
  implements: 'routes:mock'
};
