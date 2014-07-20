var events = require('events');

/**
 * Respond to callback requests
 * @constructor
 */
var Responder = function() {
  this.incoming = new events.EventEmitter();
}



/**
 * Respond to request
 * @abstract
 */
Responder.prototype.respond = function(request) {
  throw new Error('ParentResponder: Must be implemented by subclass!');
}



/** EXPORTS */
module.exports = Responder;