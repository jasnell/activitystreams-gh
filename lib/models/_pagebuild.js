/** jshint node:true **/
;
const as     = require('activitystrea.ms');
const ld     = require('linkeddata-vocabs');
const vocab  = require('../ghvocab');
const cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.content(vocab.PageBuild).
    id(info.url).
    set(vocab.status, info.status);
  if (info.error && info.error.message) {
    builder.summary(info.error.message);
  }
  if (info.pusher) {
    builder.attributedTo(
      this.cached_user(info.pusher)
    );
  }

  // commit reference

  builder.duration(info.duration, {type:ld.xsd.nonNegativeInteger});

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
