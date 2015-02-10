
/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Reference).
    id(info.url).
    displayName(info.ref);
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
