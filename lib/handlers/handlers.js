var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

exports.ping = require('./_ping').bind(exports);
exports.commit_comment = require('./_commit_comment').bind(exports);
exports.create = require('./_create').bind(exports);
exports.delete = require('./_delete').bind(exports);
exports.fork = require('./_fork').bind(exports);
exports.gollum = require('./_gollum').bind(exports);
exports.issue_comment = require('./_issue_comment').bind(exports);
exports.issues = require('./_issues').bind(exports);
exports.member = require('./_member').bind(exports);
exports.membership = require('./_membership').bind(exports);
exports.page_build = require('./_page_build').bind(exports);
exports.public = require('./_public').bind(exports);
exports.pull_request = require('./_pull_request').bind(exports);
exports.pull_request_review_comment = require('./_pull_request_review_comment').bind(exports);
exports.release = require('./_release').bind(exports);
exports.repository = require('./_repository').bind(exports);
exports.team_add = require('./_team_add').bind(exports);
exports.watch = require('./_watch').bind(exports);
exports.status = require('./_status').bind(exports);
exports.push = require('./_push').bind(exports);

exports.set_sender = function(builder, sender) {
  builder.actor(cached(sender.url,sender.type||'User',sender));
};

exports.builder = function(type, sender, types) {
  if (types && !Array.isArray(types))
    types = [types];
  var builder = !types ? type() : type.apply(this, types) ;
  builder.publishedNow();
  exports.set_sender(builder, sender);
  return builder;
};
