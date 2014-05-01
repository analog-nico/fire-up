'use strict';

// Fire me up!

module.exports = {
  implements: 'routes:mock'
};

module.exports.factory = function () {

  var message = 'You are mocking me!';

  function register(app) {
    app.get('/easter', function (req, res) {
      res.send('egg');
    });
    app.get('/', function(req, res){
      res.send(message);
    });
  }

  return { register: register };

};
