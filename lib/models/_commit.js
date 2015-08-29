/** jshint node:true **/
'use strict';

const as     = require('activitystrea.ms');
const ld     = require('linkeddata-vocabs');
const vocab  = require('../ghvocab');
const cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Commit);
  builder.displayName(info.sha);
  builder.id(info.url);

  var commit = info.commit;
  builder.summary(commit.message);

  if (commit.tree) {
    builder.set(
      vocab.tree,
      this.cached(commit.tree.url, 'Tree', commit.tree)
    );
  }

  if (commit.committer) {
    builder.set(
      vocab.committer,
      this.cached(
        commit.committer.url,
        commit.committer.type||'User',
        commit.committer)
    );
  }

  if (commit.author) {
    builder.attributedTo(
      this.cached_user(commit.author)
    );
  }

  var parents = commit.parents;
  if (parents) {
    if (!Array.isArray(parents)) parents = [parents];
    for (var n = 0, l = parents.length; n < l; n++) {
      builder.set(
        vocab.parent,
        cached(parents[n].url, 'Commit', parent[n])
      );
    }
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
