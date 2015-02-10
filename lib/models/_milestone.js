/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');
var cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Milestone).
    id(info.url).
    set(vocab.number, info.number, {type:ld.xsd.nonNegativeInteger}).
    set(vocab.state, info.state).
    displayName(info.title).
    content(info.description).
    set(
      vocab.open_issues,
      info.open_issues,
      {type:ld.xsd.nonNegativeInteger}).
    set(
      vocab.closed_issues,
      info.closed_issues,
      {type:ld.xsd.nonNegativeInteger});

  if (info.creator) {
    builder.attributedTo(
      this.cached_user(info.creator)
    );
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
