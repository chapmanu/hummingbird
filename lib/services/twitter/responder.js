// System
var util = require('util');

// Parent
var Responder = require('../core').Responder;


/**
 * Respond to callback requests for twitter
 * @constructor
 * @extends Responder
 */
var TwitterResponder = function() {
  Responder.call(this);
}

// Inherit
util.inherits(TwitterResponder, Responder);


/**
 * Respond to request
 */
TwitterResponder.prototype.respond = function(request) {
  return {code: 404}; // Twitter module does not take callbacks, 404 requester.
}


/** EXPORTS */
module.exports = TwitterResponder;