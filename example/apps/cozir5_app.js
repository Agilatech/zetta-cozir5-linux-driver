module.exports = function testApp(server) {
  
  var cozir5DeviceQuery = server.where({type:'COZIR5_Sensor'});
  
  server.observe([cozir5DeviceQuery], function(cozir5Device){
    setInterval(function(){
      cozir5Device.call('log-data');
    }, 10000);
  });
  
}