/** jshint node:true **/

var LRU = require("lru-cache");

var options = {
  max: 500,
  length: function(n) {
    return 1; // todo determine this properly...
  },
  maxAge: 1000 * 60 * 60
};

var cache = LRU(options);

exports.get = function(key, loader, args) {
  var ret;
  if (key) {
    ret = cache.get(key);
  }
  if (!ret && typeof loader === 'function') {
    if (args && !Array.isArray(args))
      args = [args];
    ret = loader.apply(null, args);
    if (ret) cache.set(key, ret);
  }
  return ret;
};

exports.reset = cache.reset;
exports.del = cache.del;
exports.set = cache.set;
exports.has = cache.has;
