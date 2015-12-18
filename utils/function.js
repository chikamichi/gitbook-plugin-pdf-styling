/**
 * **Collection of utilities related to functions.**

 * @module utils/function
 */

module.exports = {
  /**
   * Check whether an alledgedly callback is actually callable. If not, trumps
   * it with a no-op function.
   */
  ensureCallable: function(callback) {
    return (typeof callback === 'function') ? callback : function() {};
  }
}
