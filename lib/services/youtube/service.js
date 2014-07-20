// Modules
var util = require('util');

// Parents
var Service = require('../core').Service;

// Local
var Stream   = require('./stream.js');
var Post     = require('./post.js');


/**
 * Provides interaction with the YouTube API
 * @constructor
 * @extends Service
 */
var YoutubeService = function() {
  Service.call(this, Stream, Post);
}

// Try as you might, javascript just can't hang
util.inherits(YoutubeService, Service);



/**
 * Configuration
 */
YoutubeService.prototype.configuration = {
  SERVICE_NAME: 'youtube',
  MAX_KEYWORDS: 0,
  MAX_ACCOUNTS: 0
};




/** EXPORT */
module.exports = YoutubeService = new YoutubeService();