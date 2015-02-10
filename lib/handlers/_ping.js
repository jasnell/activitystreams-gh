var cached = require('../models').cached;
var as = require('activitystrea.ms');

module.exports = function(info) {
  return as.announce().
       displayName(info.zen).
       actor(info.hook.url).
       object(cached(info.hook.url, 'Hook', info.hook)).
       publishedNow().
       get();
};
