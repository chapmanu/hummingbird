var sugar = require('sugar');

/** @constant */ var PERIOD_DEFAULT   = 1;
/** @constant */ var INTERVAL_DEFAULT = 1;


/**
 * Circular Buffer that rotates through a list of functions,
 * completing a rotation within a set period, and executing
 * each function on an even time interval.
 *
 * @constructor
 * @param {number} period - (ms) length one full rotation.
 */
var Rotator = function(period) {
  this._period   = period || PERIOD_DEFAULT;
  this._interval = INTERVAL_DEFAULT;
  this._timeout  = null;
  
  this._items  = [];
  this._queued = null;
};



Rotator.prototype = {
  
  /**
   * Get the period
   * 
   * @returns {number}
   */
  period: function() {
    return this._period;
  },
  
  
  
  /**
   * Update period of rotation. Recalculated interval
   * effective next item.
   * 
   * @param {number} period - (ms) length one full rotation.
   */
  updatePeriod: function(period) {
    this._period = period;
    this._recalculate();
  },
  
  
  
  /**
   * Adds a function to the end of the buffer, relative to
   * the currently queued function. Recalculated interval
   * effective next item.
   * 
   * @param {function} method - Queued function for execution
   */
  add: function(container) {
    this._items.push(this._default(container));
    this._recalculate();
  },
  
  
  
  /**
   * Remove a function from the buffer. If function is currently
   * queued, it is removed, and the next function in the buffer
   * is queued. Interval is recalculated and reset.
   *
   * @param {function} method - Function to be removed from buffer
   */
  remove: function(container) {
    var item = this._find(container);
    if (!item) return false;
    if (this._queued === this.item) {
      this._clearQueued();
      this._queueNext();
    } else {
      var i = this._items.indexOf(item);
      this._items.splice(i, 1);
    }
    this._recalculate();
    return true;
  },
  
  
  
  /**
   * Start the rotation, keep everything in place
   */
  start: function() {
    if (!this._queued && !this._timeout && this.length() > 0) {
      this._queueNext();
      return true;
    } else
    if (this._queued && !this._timeout) {
      this._timeout = setTimeout(this._execute.bind(this), this._interval);
      return true;
    }
    return false;
  },
  
  
  
  /**
   * Stop the rotation, keep everything in place
   */
  stop: function() {
    clearTimeout(this._timeout);
    this._timeout = null;
    return true;
  },
  
  
  
  /**
   * Total number of items in buffer & queued.
   *
   * @returns {number}
   */
  length: function() {
    return this._items.length + !!this._queued;
  },
  
  
  
  /**
   * Boolean of active or waiting
   *
   * @returns {boolean} - true if active, false if not
   */
  active: function() {
    return (!!this._timeout);
  }
  
  
};




/**
 * Ensure container consistency
 *
 * @param   {object} container
 * @returns {object} container
 */
Rotator.prototype._default = function(container) {
  return {
    context: container.context || this,
    key:     container.key     || this._containerString(container),
    params:  container.params  || {},
    func:    container.func    || function() { return null; }
  };
};





/**
 * Find a method in the buffer
 *
 * @param {function} method - Function to find
 * @returns {function} Found function, or false if not found
 */
Rotator.prototype._find = function(container) {
  var key = container;
  if (typeof container === 'object') {
    key = this._default(container).key;
  }
  if (this._queued && this._queued.key === key) {
    return this._queued;
  }
  var item = this._items.find(function(n) {
    return n.key === key;
  });
  if (item) return item;
  return false;
};



/**
 * Queue the next function for execution, and return
 * the current function to the end of the buffer if it
 * exists.
 */
Rotator.prototype._queueNext = function() {
  if (this._queued) {
    this._items.push(this._queued);
    this._clearQueued();
  }
  this._queued = this._items.shift();
  this._timeout = setTimeout(this._execute.bind(this), this._interval);
};



/**
 * Clear the currently queued item, and stop the interval
 */
Rotator.prototype._clearQueued = function() {
  clearTimeout(this._timeout);
  this._timeout = null;
  this._queued = null;
};



/**
 * Recalculate the interval between method executions.
 * WARNING: this is a naive approach and only covers a
 * few corner cases. It will need to be rewritten.
 */
Rotator.prototype._recalculate = function() {
  var items  = this.length();
  var period = (this._period > 0) ? this._period : PERIOD_DEFAULT;
  this._interval = (period > items) ? Math.floor(period/items) : INTERVAL_DEFAULT;
};



/**
 * Execute the queued method.
 */
Rotator.prototype._execute = function() {
  if (!this._queued) return false;
  if (!(typeof this._queued.func === 'function')) return false;
  var q = this._queued;
  var result = q.func.apply(q.context, Object.values(q.params));
  this._queueNext();
  return result;
};



/**
 * Get a formatted toString of method to compare with
 *
 * @param   {function} method
 * @returns {string}
 */
Rotator.prototype._containerString = function(container) {
  var clone = Object.clone(container, true);
  clone.func = clone.func.toString();
  return JSON.stringify(clone);
};




/** exports */
module.exports = Rotator;