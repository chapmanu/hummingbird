// System
var util = require('util');

// Parent
var Responder = require('../core').Responder;


/**
 * Respond to callback requests for youtube
 * @constructor
 * @extends Responder
 */
var YoutubeResponder = function() {
  Responder.call(this);
}

// Inherit
util.inherits(YoutubeResponder, Responder);


/**
 * Respond to request
 */
YoutubeResponder.prototype.respond = function(request) {
  return {code: 404}; // Youtube module does not take callbacks, 404 requester.
}


/** EXPORTS */
module.exports = YoutubeResponder;