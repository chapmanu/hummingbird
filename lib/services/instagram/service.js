// Modules
var util = require('util');

// Parents
var Service = require('../core').Service;

// Local
var Stream   = require('./stream.js');
var Post     = require('./post.js');


/**
 * Provides interaction with the Instagram API
 * @constructor
 * @extends Service
 */
var InstagramService = function() {
  Service.call(this, Stream, Post);
}

// Try as you might, javascript just can't hang
util.inherits(InstagramService, Service);



/**
 * Configuration
 */
InstagramService.prototype.configuration = {
  SERVICE_NAME: 'instagram',
  MAX_KEYWORDS: 0,
  MAX_ACCOUNTS: 0
};




/** EXPORT */
module.exports = InstagramService = new InstagramService();