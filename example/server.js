var zetta = require('zetta');
var co2_sensor = require('../index');
var app = require('./apps/cozir5_app');

zetta()
	.name('Zetta Server for COZIR5')
	.use(co2_sensor)
    .use(app)
	.listen(1337, function() {
		console.log('Zetta COZIR5 Server running on port 1337');
	});
