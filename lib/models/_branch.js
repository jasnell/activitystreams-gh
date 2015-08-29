/** jshint node:true **/
'use strict';

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Branch);
  //builder.id(info.url);
  //builder.set(vocab.id, info.id, {type:ld.xsd.nonNegativeInteger});
  builder.displayName(info.name);

  // commit details...

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
