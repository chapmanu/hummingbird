var fs   = require('fs');
var path = require('path');

// App dependencies
var utils = require('./utils.js');


/**
 * Hummingbird
 *
 * @constructor
 */
var Hummingbird = function() {
  this.ts = new Date();
};


module.exports = Hummingbird = new Hummingbird();