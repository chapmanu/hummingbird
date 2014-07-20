/**
 * Keyword model
 */
module.exports = {
  
  tableName: 'keywords-'+HB.env,
  connection: HB.config.adapter+'_connection',
  
  schema: true,

  attributes: {
  	
  	service: {
  	  type:      'string',
  	  required:  true,
  	  minLength: 5,
  	  maxLength: 12
  	},
  	phrase: {
  	  type:     'string',
  	  required: true,
  	  minLength: 3,
  	  maxLength: 30
  	},
    
    
    condensed: function() {
      return {
        service: this.service,
        phrase:  this.phrase
      }
    }
    
  },
  
  
  
  /**
   * Callbacks
   * necessary because sails is still a youngin'
   */
  beforeCreate: function(values, cb) {
    // blank query
    if (!values) return cb({BadQuery:true});
    
    Keyword.findOne(values, function(err, k) {
      // Model exists
      if (!err && k) {
        cb({ModelExists:true});
    
      // Some error while fetching model
      } else if (err) {
        cb(err);
    
      // Valid
      } else {
        cb();
      }
    });
    
  },
  
  
  
  beforeDestroy: function(criteria, cb) {
    criteria = criteria.where;
    
    // blank query
    if (!criteria) return cb({BadQuery:true});
    
    // missing required params
    if (!criteria.service || !criteria.phrase)
      return cb({BadQuery:true});
    
    Keyword.findOne(criteria).done(function(err, k) {
      // Model does not exist
      if (!err && !k) {
        cb({ModelExists:false});
      
      // Some error while fetching model
      } else if (err) {
        cb(err);
      
      // Valid
      } else {
        cb(null);
      }
    });
  }
  
};