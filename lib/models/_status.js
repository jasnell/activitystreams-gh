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

  var combined = info.sha !== undefined;
  var type = combined ?
    vocab.CombinedStatus :
    vocab.Status;

  var builder = combined ?
    as.collection(type) :
    as.object(type);

  if (combined) {
    builder.id(info.url).
      set(vocab.state, info.state).
      set(vocab.sha, info.sha);
    if (info.total_count)
      builder.totalItems(info.total_count);
    if (info.statuses) {
      for (var n = 0, l = info.statuses.length; n < l; n++) {
        builder.item(convert(info.statuses[n]));
      }
    }

    // repository
    // commit_url

  } else {
    builder.id(info.url).
      set(vocab.id, info.id, {type:ld.xsd.nonNegativeInteger}).
      set(vocab.state, info.state).
      url(info.target_url);
    if (info.description) {
      builder.summary(info.description);
    }
    if (info.context) {
      builder.set(vocab.context, info.context);
    }
    if (info.creator) {
      builder.attributedTo(
        this.cached_user(info.creator)
      );
    }
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
