/** jshint node:true **/
'use strict';

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }

  var type = info.type;
  var builder;
  switch(type) {
    case 'file':
      builder = as.document(vocab.Content);
      break;
    case 'symlink':
      builder = as.document(vocab.Symlink);
      break;
    case 'dir':
      builder = as.collection(vocab.Content);
      break;
    case 'submodule':
      builder = as.object(vocab.Submodule);
      break;
  }
  builder.id(info.id).
    name(info.name).
    set(vocab.path, info.path).
    set(vocab.sha, info.sha).
    set(vocab.size, info.size, {type:ld.xsd.nonNegativeInteger}).
    builder.url(info.html_url);

  // git_url
  // submodule_git_url

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
