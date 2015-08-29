'use strict';

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var repository = info.repository;

  var builder = this.builder(as.activity, info.sender, vocab.Push);

  var obj = as.collection(vocab.PushSummary);

  obj.set(vocab.ref, info.ref).
      set(vocab.after, info.after).
      set(vocab.before, info.before);

  if (info.created) {
    obj.set(vocab.created, info.created, {type:ld.xsd.boolean});
  }
  if (info.deleted) {
    obj.set(vocab.deleted, info.deleted, {type:ld.xsd.boolean});
  }
  if (info.forced) {
    obj.set(vocab.forced, info.forced, {type:ld.xsd.boolean});
  }
  if (info.base_ref) {
    obj.set(vocab.base_ref, info.base_ref);
  }
  if (info.compare) {
    obj.url(
      as.link().
         href(info.compare).
         rel('compare')
    );
  }
  for (var n = 0, l = info.commits.length; n < l; n++) {
    var commit = info.commits[n];
    obj.items(cached(commit.url, 'RawCommit', commit));
  }

  if (info.head) {
    builder.set(vocab.head_commit, info.head);
  } else if (info.head_commit) {
    builder.set(vocab.head_commit, info.head_commit.sha);
  }

  builder.object(obj);

  builder.target(cached(repository.url, 'Repository', repository));

  return builder.get();
};
