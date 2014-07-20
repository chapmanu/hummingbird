var events = require('events');
var Services = require('./services.js');

var Switchboard = {
  
  // Inside Stream
  inside: new events.EventEmitter(),
  
  // Format Stream
  format: new events.EventEmitter(),
  
  
  delegate: function(service, model, action, param) {
    Services.command(service, { 
      model:  model,
      action: action,
      param:  param
    });
  },
  
  
  delegateAccount: function(action, account) {
    this.delegate(account.service, 'account', action, account);
  },
  
  
  delegateKeyword: function(action, keyword) {
    this.delegate(keyword.service, 'keyword', action, keyword);
  }
  
};

module.exports = Switchboard;