// System
var util = require('util');
var sugar = require('sugar');

// Parent
var Responder = require('../core').Responder;


/**
 * Respond to callback requests for Instagram
 * @constructor
 * @extends Response
 */
var InstagramResponder = function() {
  Responder.call(this);
}

// Inherit
util.inherits(InstagramResponder, Responder);


/**
 * Respond to request
 */
InstagramResponder.prototype.respond = function(request) {
  var self = this;
  if (request.query['hub.challenge']) {
    return {code: 200, content: request.query['hub.challenge']};
  } else {
    request.body.forEach(function(update) {
      self.incoming.emit('update', update);
    });
    return {code: 200};
  }
}


/** EXPORTS */
module.exports = InstagramResponder;