// Modules
var util = require('util');

// Parents
var Service = require('../core').Service;

// Local
var Stream   = require('./stream.js');
var Post     = require('./post.js');


/**
 * Provides interaction with the Facebook API
 * @constructor
 * @extends Service
 */
var FacebookService = function() {
  Service.call(this, Stream, Post);
}

// Try as you might, javascript just can't hang
util.inherits(FacebookService, Service);



/**
 * Configuration
 */
FacebookService.prototype.configuration = {
  SERVICE_NAME: 'facebook',
  MAX_KEYWORDS: 0,
  MAX_ACCOUNTS: 0
};




/** EXPORT */
module.exports = FacebookService = new FacebookService();