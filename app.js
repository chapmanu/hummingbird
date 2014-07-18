(function() {
  var hummingbird;
  try {
    hummingbird = require('./lib');
  } catch (e) {
    console.log('An error occured while starting hummingbird.');
    console.log(e);
    return;
  }
  
  console.log('Initializing Hummingbird...');
  hummingbird.initialize();
})();