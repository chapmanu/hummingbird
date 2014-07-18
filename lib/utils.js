var path = require('path');

/**
 * Miscellaneous useful functions
 */
module.exports = {
  
  /** Memoize paths */
  paths: null,
  
  /**
   * Generate a hash of absolute file dirs for the app
   */
  loadPaths: function() {
    if (this.paths && paths.hasOwnProperty('base')) return this.paths;
    var base = path.resolve(__dirname,'../');
    this.paths = {
      base:   base,
      config: path.resolve(base,  'config'),
      lib:    path.resolve(base,  'lib'),
      plugins: path.resolve(base, 'plugins')
    };
    return this.paths;
  },
  
  
  
  /**
   * Recursively merge object b into object a
   */
  merge: function(a, b) {
    for (var key in b) {
      // a does not have key
      if (!a.hasOwnProperty(key)) continue;
      
      // a and b values are not equivalent types at key
      if ((typeof a[key]) !== (typeof b[key])) continue;
      
      // attribute is an object, recursively merge
      if (typeof b[key] === 'object') {
        this.merge(a[key], b[key]);
        continue;
      }
      
      // otherwise replace
      a[key] = b[key];
    }
    return a;
  },
  
  
  
  /**
   * Get the absolute path
   */
  path: function(base, args) {
    return path.resolve.apply(this, this.merge(arguments, { 0:this.paths[base] }));
  }
  
  
};