var ErrorHelper = require('./helpers/error_helper.js');

/**
 * Accounts Controller
 */
module.exports = {
  
  /**
   * Index
   */
  index: function(req, res) {
    ErrorHelper.noMethod(res);
  },
  
  
  /**
   * Create
   */
  create: function(req, res) {
    
    Account.create(req.body).done(function(err, account) {
      // error
      if (err) return ErrorHelper.handle(res,err);
      
      // cool beans
      Switchboard.delegateAccount('add', account.condensed());
      res.json({created:{account: account.condensed()}});
    });
    
  },
  
  
  
  /**
   * Update
   */
  update: function(req, res) {
    ErrorHelper.noMethod(res);
  },
  

  
  /**
   * Destroy
   */
  destroy: function(req, res) {
    
    Account.destroy(req.body, function(err) {
      if (err) return ErrorHelper.handle(res,err);
      
      Switchboard.delegateAccount('remove', req.body);
      res.json({destroyed: {account: req.body}});
    });
    
  }
  
  
  
};