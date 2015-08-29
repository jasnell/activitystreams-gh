/** jshint node:true **/
;

const cache = require('./_default_cache');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

exports = module.exports = function(options) {
  cache = options.cache || cache;
};

exports.Asset        = require('./_asset').bind(exports);
exports.Blob         = require('./_blob').bind(exports);
exports.Branch       = require('./_branch').bind(exports);
exports.Comment      = require('./_comment').bind(exports);
exports.Commit       = require('./_commit').bind(exports);
exports.Content      = require('./_content').bind(exports);
exports.Hook         = require('./_hook').bind(exports);
exports.Issue        = require('./_issue').bind(exports);
exports.Milestone    = require('./_milestone').bind(exports);
exports.Organization = require('./_organization').bind(exports);
exports.Pagebuild    = require('./_pagebuild').bind(exports);
exports.PullRequest  = require('./_pullrequest').bind(exports);
exports.RawCommit    = require('./_rawcommit').bind(exports);
exports.RawTag       = require('./_rawtag').bind(exports);
exports.Reference    = require('./_ref').bind(exports);
exports.Release      = require('./_release').bind(exports);
exports.Repository   = require('./_repository').bind(exports);
exports.Status       = require('./_status').bind(exports);
exports.Tag          = require('./_tag').bind(exports);
exports.Team         = require('./_team').bind(exports);
exports.Tree         = require('./_tree').bind(exports);
exports.User         = require('./_user').bind(exports);

exports.cached_user = function(user) {
  return exports.cached(user.url,user.type||'User',user);
};

exports.timestamps = function(builder, info) {
  if (info.created_at) {
    builder.published(new Date(info.created_at));
  }
  if (info.updated_at) {
    builder.updated(new Date(info.updated_at));
  }
  if (info.closed_at) {
    builder.set(
      vocab.closed,
      new Date(info.closed_at),
      {type:ld.xsd.dateTime});
  }
  if (info.due_on) {
    builder.set(
      vocab.closed,
      new Date(info.due_on),
      {type:ld.xsd.dateTime});
  }
  if (info.merged_at) {
    builder.set(
      vocab.merged,
      new Date(info.merged_at),
      {type:ld.xsd.dateTime});
  }
};

exports.cached = function(key, fn, args) {
  if (typeof fn === 'string')
    fn = exports[fn];
  if (typeof fn !== 'function') {
    throw new Error('A valid conversion function must be provided');
  }
  return cache.get(key, fn, args);
};

exports.resetCache = function() {
  cache.reset();
};
