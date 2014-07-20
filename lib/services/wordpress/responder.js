// System
var util = require('util');
var sugar = require('sugar');

// Parent
var Responder = require('../core').Responder;


/**
 * Respond to callback requests for Wordpress
 * @constructor
 * @extends Response
 */
var WordpressResponder = function() {
  Responder.call(this);
}

// Inherit
util.inherits(WordpressResponder, Responder);


/**
 * Respond to request
 */
WordpressResponder.prototype.respond = function(request) {
  this.incoming.emit('update', request.body);
  return {code: 200};
}


/** EXPORTS */
module.exports = WordpressResponder;