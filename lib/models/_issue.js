/** jshint node:true **/
;

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');
const cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Issue).
    id(info.url).
    set(vocab.id, info.id).
    url(info.html_url).
    set(vocab.state, info.state).
    set(vocab.number, info.number, {type:ld.xsd.nonNegativeInteger}).
    displayName(info.title).
    content(info.body);

  if (info.user) {
    builder.attributedTo(
      this.cached_user(info.user)
    );
  }

  if (info.labels) {
    for (var n = 0, l = info.labels.length; n < l; n++) {
      var label = info.labels[n];
      builder.tag(
        as.object().
          id(label.url).
          displayName(label.name).
          set(vocab.color, label.color)
      );
    }
  }

  if (info.assignee) {
    builder.set(
      vocab.assignee,
      this.cached_user(info.assignee));
  }

  if (info.milestone) {
    builder.set(
      vocab.milestone,
      cached(info.milestone.url, 'Milestone', info.milestone)
    );
  }

  var replies = as.collection().
    totalItems(info.comments);
  builder.replies(replies);

  // pull_request

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
