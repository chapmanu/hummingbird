/**
 * Account model
 */
module.exports = {
  
  tableName: 'accounts-'+HB.env,
  connection: HB.config.adapter+'_connection',
  
  schema: true,

  attributes: {
  	
  	service:    {
  	  type:      'string',
  	  required:  true,
  	  minLength: 5,
  	  maxLength: 12
  	},
  	service_id: {
  	  type:      'string',
  	  required : true,
  	  minLength: 1
  	},
  	auth_token: 'string',
  	last_checked: 'datetime',
    
    
    condensed: function() {
      return {
        service:    this.service,
        service_id: this.service_id,
        auth_token: this.auth_token
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
    
    Account.findOne(values, function(err, a) {
      // Model exists
      if (!err && a) {
        cb({ModelExists:true});
    
      // Some error while fetching account
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
    if (!criteria.service || !criteria.service_id)
      return cb({BadQuery:true});
    
    Account.findOne(criteria).done(function(err, a) {
      // Model does not exist
      if (!err && !a) {
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