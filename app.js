(function() {
  var app;
  try {
    app = require('./lib');
  } catch (e) {
    console.log('An error occured while starting hummingbird.');
    console.log(e);
    return;
  }
  
  console.log('Initializing Hummingbird...');
  app.initialize();
  
  console.log(HB);
})();