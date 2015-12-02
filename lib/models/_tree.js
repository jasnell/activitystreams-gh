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
  var builder = as.collection(vocab.Tree).
    id(info.url).
    set(vocab.sha, info.sha).
    set(vocab.truncated, info.truncated, {type:ld.xsd.boolean});

  if (info.tree) {
    for (var n = 0, l = info.tree.length; n < l; n++) {
      var item = info.tree[n];
      var obj = as.content().
        id(item.url).
        set(vocab.path, item.path).
        set(vocab.sha, item.sha).
        set(vocab.mode, item.mode).
        set(vocab.type, item.type).
        set(vocab.size, item.size, {type:ld.xsd.nonNegativeInteger});
      builder.items(obj);
    }
  }
  this.timestamps(builder, this);

  return builder.get();
}

module.exports = convert;
