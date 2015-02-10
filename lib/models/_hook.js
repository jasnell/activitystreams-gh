/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Hook).
    id(info.url).
    set(vocab.id, info.id).
    displayName(info.name).
    set(vocab.active, info.active, {type:ld.xsd.boolean}).
    set(vocab.events, info.events);

  if (info.test_url) {
    builder.url(
      as.link().
         href(info.test_url).
         rel('test')
    );
  }
  if (info.ping_url) {
    builder.url(
      as.link().
         href(info.ping_url).
         rel('ping')
    );
  }
  if (info.config) {
    builder.url(
      as.link().
         href(info.config.url).
         rel('config')
    );
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
