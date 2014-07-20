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
    Account.create(req.body)
    .then(function(account) {
      // cool beans
      //Switchboard.delegateAccount('add', account.condensed());
      res.status(200).json({created:{account: account.condensed()}});
    })
    .fail(function(error) {
      ErrorHelper.handle(res, error.originalError);
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
      
      //Switchboard.delegateAccount('remove', req.body);
      res.status(200).json({destroyed: {account: req.body}});
    });
    
  }
  
  
  
};