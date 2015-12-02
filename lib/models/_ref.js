
/** jshint node:true **/
'use strict';

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Reference).
    id(info.url).
    name(info.ref);
  if (info.object) {
    builder.context(
      as.link(vocab.Commit).
         href(info.object.url).
         set(vocab.sha, info.object.sha)
    );

  this.timestamps(builder, info);}
  return builder.get();
}

module.exports = convert;
