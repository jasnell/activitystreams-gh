/** jshint node:true **/

var as  = require('activitystrea.ms');
var ld  = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Tag);
  //builder.id(info.url);
  //builder.set(vocab.id, info.id, {type:ld.xsd.nonNegativeInteger});
  builder.displayName(info.name);

  // commit
  // zipball_url
  // tarball_url

  this.timestamps(builder, this);

  return builder.get();
}

module.exports = convert;
