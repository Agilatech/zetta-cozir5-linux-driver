/*
Copyright © 2016 Agilatech. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

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
  this._streamCo2   = null;

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
                active: this.cozir5_sensor.deviceActive(),
                co2: this.co2
            };
        });
};

cozir5.prototype.startIsochronal = function(callback) {
    this.state = 'chron-on';
    
    // load values right away before the timer starts
    this.readCo2();
    
    var self = this;
    
    this._chron = setInterval(function() { self.readCo2(); }, this.chronPeriod);
    
    callback();
}

cozir5.prototype.stopIsochronal = function(callback) {
    this.state = 'chron-off';
    clearTimeout(this._chron);
    callback();
};

cozir5.prototype.streamCo2 = function(stream) {
    var self = this;
    this._streamCo2 = setInterval(function() { self.readCo2(); stream.write(self.co2); }, this.streamPeriod);
};

cozir5.prototype.logData = function(callback) {
    this.readCo2();
    this.log("CO2 : " + this.co2);
    callback();
}

cozir5.prototype.readCo2 = function() {
    if (this.cozir5_sensor.deviceActive()) {
        this.co2 = this.cozir5_sensor.valueAtIndexSync(0);
    }
};



