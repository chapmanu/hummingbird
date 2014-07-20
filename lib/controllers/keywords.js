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
     
     Keyword.create(req.body).done(function(err, keyword) {
       // error
       if (err) return ErrorHelper.handle(res, err);
     
       // cool beans
       Switchboard.delegateKeyword('add', keyword.condensed());
       res.json({created:{keyword: keyword.condensed()}});
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
       Switchboard.delegateKeyword('remove', req.body);
       res.json({destroyed:{keyword: req.body}});
     });
     
   }

  
};
