const device = require('zetta-device');
const sensor = require('@agilatech/cozir5');
const util = require('util');

var cozir5 = module.exports = function(options) {
  device.call(this);

  this.options = options || {};
  this.file  = this.options['file'] || "/dev/ttyS0";
  this.chronPeriod  = this.options['chronPeriod']  || 60000; //milliseconds
  this.streamPeriod = this.options['streamPeriod'] || 10000;

  this.co2       = 0;
  this.co2Stream = 0;
  this._chron       = null;
  this._streamHum   = null;
  this._streamTemp  = null;

  this.cozir5_sensor = new sensor.Cozir5(this.file);
};

util.inherits(cozir5, device);

cozir5.prototype.init = function(config) {

  config
        .type('COZIR5_Sensor')
        .state('chron-off')
        .when('chron-off', {allow: ['start-isochronal', 'log-data']})
        .when('chron-on', {allow: ['stop-isochronal', 'log-data']})
        .stream('co2Stream', this.streamCo2)
        .monitor('co2')
        .map('stop-isochronal', this.stopIsochronal)
        .map('start-isochronal', this.startIsochronal)
        .map('log-data', this.logData)
        .name(this.cozir5_sensor.deviceName())
        .remoteFetch(function() {
            return {
                 co2: this.co2
            };
        });


};

cozir5.prototype.startIsochronal = function(callback) {
    this.state = 'chron-on';
    
    // load values right away before the timer starts
    this.co2 = this.readCo2();

    var self = this;
    
    this._chron = setInterval(function() {
        self.co2 = self.readCo2();
    }, this.chronPeriod);

    callback();
}

cozir5.prototype.stopIsochronal = function(callback) {
    this.state = 'chron-off';
    clearTimeout(this._chron);
    callback();
};

cozir5.prototype.streamCo2 = function(stream) {
    var self = this;
    this._streamTemp = setInterval(function() {
        stream.write(self.readCo2());
    }, this.streamPeriod);
};

cozir5.prototype.logData = function() {
    this.log("CO2 : " + this.readCo2());
}

cozir5.prototype.readCo2 = function() {
    if (this.cozir5_sensor.deviceActive()) {
        return this.cozir5_sensor.valueAtIndexSync(0);
    }
    // else ?
};



