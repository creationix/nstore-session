/*!
 * Connect - nStore Session Store
 * Copyright(c) 2010 Tim Caswell <tim@creationix.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 * Assumes "connect" and "nstore" are in the library path
 */

var sys = require('sys'),
    nStore = require('nstore'),
    connectVersion = require('connect').version;

if(connectVersion.substring(0,1)=='0'){
   var Store = require('connect/middleware/session/store');
}else{
   var Store = require('connect/lib/middleware/session/store');
}

/**
 * Initialize nStoreSession with the given `options`.
 *
 * @param {Object} options
 * @api public
 */
var nStoreSession = module.exports = function nStoreSession(options) {
    options = options || {};
    options.maxAge = options.maxAge || 3600000; // Expunge after an hour
    var dbFile = options.dbFile || __dirname + "/sessions.db";
    Store.call(this, options);
    this.db = nStore.new(dbFile);
};

sys.inherits(nStoreSession, Store);

/**
 * Attempt to fetch session by the given `hash`.
 *
 * @param {String} hash
 * @param {Function} fn
 * @api public
 */
nStoreSession.prototype.get = function (hash, fn) {
  this.db.get(hash, function(err,data,meta){
     if(err instanceof Error){
        fn();
     }else{
        fn(null,data,meta);
     }
  });
};

/**
 * Commit the given `sess` object associated with the given `hash`.
 *
 * @param {String} hash
 * @param {Session} sess
 * @param {Function} fn
 * @api public
 */

nStoreSession.prototype.set = function (hash, sess, fn) {
    this.db.save(hash, sess, fn);
};

/**
 * Destroy the session associated with the given `hash`.
 *
 * @param {String} hash
 * @api public
 */

nStoreSession.prototype.destroy = function (hash, fn) {
    this.db.remove(hash, fn);
};

/**
 * Fetch number of sessions.
 *
 * @param {Function} fn
 * @api public
 */

nStoreSession.prototype.length = function (fn) {
    process.nextTick(function () {
      fn(this.db.length);
    });
};

/**
 * Clear all sessions.
 *
 * @param {Function} fn
 * @api public
 */

nStoreSession.prototype.clear = function (fn) {
  
    var count = this.db.length;
    Object.keys(this.db.index).forEach(function (key) {
      this.remove(key, function (err) {
        if (err) { fn(err); return; }
        count--;
        if (count === 0) {
          fn();
        }
      });
    }, this.db);
};
