/** jshint node:true **/
'use strict';

const as     = require('activitystrea.ms');
const ld     = require('linkeddata-vocabs');
const vocab  = require('../ghvocab');
const cached = require('../models').cached;
const urlt   = require('url-template');

function convert(info, options) {
  // TODO: Need Repository Information to properly resolve commit id
  if (!info) {
    return null;
  }
  var builder = as.note();

  builder.id(info.url).
    set(vocab.id, info.id).
    url(info.html_url).
    content(info.body);
  if (info.path) {
    builder.set(
      vocab.path,
      info.path);
  }
  if (info.line) {
    builder.set(
      vocab.line,
      info.line,
      {type:ld.xsd.nonNegativeInteger});
  }
  if (info.position) {
    builder.set(
      vocab.position,
      info.position,
      {type:ld.xsd.nonNegativeInteger});
  }

  // info.commit_id
  if (info.user) {
    builder.attributedTo(
      this.cached_user(info.user)
    );
  }

  this.timestamps(builder, info);

  if (options && options.event) {
    var inReplyTo = as.link();
    switch(options.event) {
      case 'commit_comment':
        var repository = options.repository;
        var commits = urlt.parse(repository.commits_url);
        inReplyTo.href(commits.expand({sha:info.commit_id}));
        break;
      case 'issue_comment':
        var issue = options.issue;
        inReplyTo.href(issue.url);
        break;
      case 'pull_request_review_comment':
        var pr = options.pull_request;
        inReplyTo.href(pr.url);
        break;
    }
    builder.inReplyTo(inReplyTo.get());
  }

  return builder.get();
}

module.exports = convert;
