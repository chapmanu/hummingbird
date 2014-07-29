// System
var util = require('util');
var sugar = require('sugar');

// Parent
var Responder = require('../core').Responder;


/**
 * Respond to callback requests for Facebook
 * @constructor
 * @extends Response
 */
var FacebookResponder = function() {
  Responder.call(this);
}

// Inherit
util.inherits(FacebookResponder, Responder);


/**
 * Respond to request
 */
FacebookResponder.prototype.respond = function(request) {
  var self = this;
  if (request.query['hub.challenge']) {
    return {code: 200, content: request.query['hub.challenge']};
  } else {
    request.body.entry.forEach(function(update) {
      self.incoming.emit('update', update);
    });
    return {code: 200};
  }
}


/** EXPORTS */
module.exports = FacebookResponder;