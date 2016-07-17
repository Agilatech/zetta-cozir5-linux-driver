var Scout = require('zetta-scout');
var util = require('util');
var Cozir5 = require('./cozir5');

var Cozir5Scout = module.exports = function() {
  Scout.call(this);
};

util.inherits(Cozir5Scout, Scout);

Cozir5Scout.prototype.init = function(next) {

  var self = this;

  var query = this.server.where({type: 'COZIR5_Sensor'});
  var options = {"file": '/dev/ttyS2', "chronPeriod": 60000, "streamPeriod": 10000};

  this.server.find(query, function(err, results) {
    if (results[0]) {
      self.provision(results[0], Cozir5, options);
    } else {
      self.discover(Cozir5, options);
    }
  });

  next();

};
