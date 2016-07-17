##Zetta cozir5 carbon dioxide sensor driver for Linux

#####This driver should work on any Linux platform, but has so far only been tested on BeagleBone Black

###Install

```
$> git clone https://github.com/zettajs/zetta-cozir5-linux-driver zetta-cozir5-linux-driver
```

###Usage

```
var zetta = require('zetta');
var cozir5 = require('zetta-cozir5-linux-driver');
```
```
zetta()
  .use(cozir5, [options])  // where options define operational paramters -- omit to accept defaults
  .listen(1337)
```

**OPTIONS**

    "file":"<serial file device>"
      /dev/ttyS0, /dev/ttyO2, etc...

    "chronPeriod":<period>
      period in milliseconds for monitored isochronal data

    "streamPeriod":<period>
      period in milliseconds for streaming data

####Example 
````
zetta().use(cozir5, {"file":"/dev/ttyS0", "chronPeriod":60000, "streamPeriod":1000})
````

initializes the cozir5 driver on serial device /dev/ttyS0 with a data monitoring period of 60 seconds and streaming data every second

### Hardware

* Beaglebone Black
* Beaglebone Green
* Should also work on Raspberry Pi as well as other Linux SBC

###Transitions

#####start-isochronal

Begins the periodic collection of carbon dioxide data. Value is monitored as co2,
and the period is set by the 'chronPeriod' option (defaults to 60 sec).

#####stop-isochronal

Stops data collection for the monitored values.

###Design

This device driver is designed for both streaming and discreet data collection from the cozir5 sensor.