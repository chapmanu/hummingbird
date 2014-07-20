var sugar   = require('sugar');
var winston = require('winston');

/**
 * Logger
 */
var Logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: function() {
        return Date.create().format('{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}.{fff}');
      }
    })
  ]
});

module.exports = Logger;