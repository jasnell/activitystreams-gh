/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

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
