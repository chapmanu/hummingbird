// Modules
var util = require('util');

// Parents
var Service = require('../core').Service;

// Local
var Stream   = require('./twitter_stream.js');
var Post     = require('./twitter_post.js');


/**
 * Provides interaction with the Twitter API
 * @constructor
 * @extends Service
 */
var TwitterService = function() {
  Service.call(this, Stream, Post);
}

// Try as you might, javascript just can't hang
util.inherits(TwitterService, Service);



/**
 * Configuration
 */
TwitterService.prototype.configuration = {
  SERVICE_NAME: 'twitter',
  MAX_KEYWORDS: 400,
  MAX_ACCOUNTS: 5000
};




/** EXPORT */
module.exports = TwitterService = new TwitterService();