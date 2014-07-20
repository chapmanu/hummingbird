var logger = require('./logger.js');

/**
 * Delegate incoming callback requests to appropriate service response
 * @constructor
 */
var Responder = function() {
  this._services = {};
}



/**
 * Add Service response
 * @param {string} service   The service identifier for delegation.
 * @param {Object} responder The service responder module.
 */
Responder.prototype.addService = function(service, responder) {
  logger.info('Responder', 'Adding service', {service: service});
  this._services[service] = responder;
}



/**
 * Respond to callback request
 * @param {string} service The service identifier for delegation.
 * @param {Object} request Request params.
 */
Responder.prototype.response = function(service, request) {
  if (this._services[service]) return this._services[service].respond(request);
  return {code: 404, content: null};
}




/** EXPORTS */
module.exports = Responder = new Responder();