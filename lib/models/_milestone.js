/** jshint node:true **/
'use strict';
const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');
const cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Milestone).
    id(info.url).
    set(vocab.number, info.number, {type:ld.xsd.nonNegativeInteger}).
    set(vocab.state, info.state).
    name(info.title).
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
