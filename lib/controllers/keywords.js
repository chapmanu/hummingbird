var ErrorHelper = require('./helpers/error_helper.js');

/**
 * KeywordsController
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
    Keyword.create(req.body)
    .then(function(keyword) {
      // delegate and responde
      //Switchboard.delegateKeyword('add', keyword.condensed());
      res.status(200).json({created:{keyword: keyword.condensed()}});
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
 
    Keyword.destroy(req.body, function(err) {
      // error
      if (err) return ErrorHelper.handle(res,err);
  
      // cool beans
      //Switchboard.delegateKeyword('remove', req.body);
      res.status(200).json({destroyed:{keyword: req.body}});
    });
 
  }

  
};
