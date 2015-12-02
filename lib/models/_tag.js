/** jshint node:true **/
'use strict';

const as  = require('activitystrea.ms');
const ld  = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Tag);
  //builder.id(info.url);
  //builder.set(vocab.id, info.id, {type:ld.xsd.nonNegativeInteger});
  builder.name(info.name);

  // commit
  // zipball_url
  // tarball_url

  this.timestamps(builder, this);

  return builder.get();
}

module.exports = convert;
