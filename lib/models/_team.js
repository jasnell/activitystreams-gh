/** jshint node:true **/
;

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

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
