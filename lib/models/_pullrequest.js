/** jshint node:true **/

var as     = require('activitystrea.ms');
var ld     = require('linkeddata-vocabs');
var vocab  = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.offer(vocab.PullRequest).
    id(info.url).
    set(vocab.id, info.id).
    url(info.html_url).
    set(vocab.number, info.number, {type:ld.xsd.nonNegativeInteger}).
    set(vocab.state, info.state).
    displayName(info.title).
    content(info.body);

  this.timestamps(builder, info);

  if (info.user) {
    builder.actor(
      this.cached_user(info.user)
    );
  }

  builder.object(head.call(this,info.head)).
          target(head.call(this,info.base));

  if (info.diff_url) {
    builder.url(
      as.link().
         href(info.diff_url).
         rel('diff')
    );
  }
  if (info.patch_url) {
    builder.url(
      as.link().
         href(info.patch_url).
         rel('patch')
    );
  }
  if (info.issue_url) {
    builder.url(
      as.link().
         href(info.issue_url).
         rel('issue')
    );
  }
  if (info.commits_url) {
    builder.url(
      as.link().
         href(info.commits_url).
         rel('commits')
    );
  }
  if (info.review_comments_url) {
    builder.url(
      as.link().
         href(info.review_comments_url).
         rel('review_comments')
    );
  }
  if (info.comments_url) {  // TODO: switch to replies
    builder.url(
      as.link().
         href(info.comments_url).
         rel('comments')
    );
  }
  if (info.statuses_url) {
    builder.url(
      as.link().
         href(info.statuses_url).
         rel('statuses')
    );
  }


  return builder.get();
}

function head(info) {
  var builder = as.object().
    displayName(info.label).
    set(vocab.ref, info.ref).
    set(vocab.sha, info.sha);

  if (info.user) {
    builder.attributedTo(
      this.cached_user(info.user)
    );
  }

  if (info.repo) {
    builder.context(
      this.cached(info.repo.url, 'Repository', info.repo)
    );
  }

  return builder.get();
}

module.exports = convert;
