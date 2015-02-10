/** jshint node:true **/

var as     = require('activitystrea.ms');
var ld     = require('linkeddata-vocabs');
var vocab  = require('../ghvocab');
var cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Commit).
    displayName(info.sha).
    id(info.url).
    summary(info.message);

  if (info.tree) {
    builder.set(
      vocab.tree,
      cached(info.tree.url, 'Tree', info.tree)
    );
  }

  if (info.committer) {
    builder.set(
      vocab.committer,
      this.cached_user(info.committer)
    );
  }

  if (info.author) {
    builder.attributedTo(
      this.cached_user(info.author)
    );
  }

  var parents = info.parents;
  if (parents) {
    if (!Array.isArray(parents)) parents = [parents];
    for (var n = 0, l = parents.length; n < l; n++) {
      builder.set(
        vocab.parent,
        cached(parents[n].url, 'Commit', parents[n])
      );
    }
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
