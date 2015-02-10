/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.group().
    id(info.url).
    set(vocab.id, info.id, {type:ld.xsd.nonNegativeInteger}).
    displayName(info.name).
    summary(info.description);

  // members
  // respositories

  this.timestamps(builder, this);

  return builder.get();
}

module.exports = convert;
