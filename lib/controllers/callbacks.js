var Responder = require('../responder.js');

/**
 * Callbacks Controller
 */
module.exports = {

  receive: function (req, res) {
    // Forward to proper handler
    var response = Responder.response(req.params.service, req);
    res.send(response.code, response.content);
  }
  
};