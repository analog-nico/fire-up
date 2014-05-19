'use strict';

// Fire me up!

module.exports = {
  implements: 'plugins/routes:users'
};

module.exports.factory = function () {

  function register(app) {
    app.get('/users/:username', function(req, res){
      res.send('Hello ' + req.params.username);
    });
  }

  return { register: register };

};
