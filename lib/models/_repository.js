/** jshint node:true **/
'use strict';

const as     = require('activitystrea.ms');
const vocab  = require('../ghvocab');
const ld     = require('linkeddata-vocabs');
const urlt   = require('url-template');
const cached = require('../models').cached;

function convert(info) {
  var builder =
    as.object(vocab.Repository).
      displayName(info.name).
      id(info.url).
      set(vocab.private, info.private, {type: ld.xsd.boolean}).
      url(info.html_url).
      summary(info.description).
      set(vocab.fork, info.fork, {type: ld.xsd.boolean});

  if (info.owner) {
    builder.attributedTo(
      this.cached_user(info.owner)
    );
  }

  this.timestamps(builder, info);

  if (info.parent) {
    builder.set(vocab.parent, convert(info.parent));
  }
  if (info.source) {
    builder.set(vocab.source, convert(info.source));
  }

  if (info.forks_url) {
    builder.set(
      vocab.forks,
      as.collection().
         totalItems(info.forks).
         id(info.forks_url)
    );
  }

  if (info.events_url) {
    var events_url = urlt.parse(info.events_url);
    builder.set(
      vocab.events,
      as.collection().id(events_url.expand({}))
    );
  }

  if (info.branches_url) {
    var branches_url = urlt.parse(info.branches_url);
    builder.set(
      vocab.branches,
      as.collection().id(branches_url.expand({}))
    );
  }

  if (info.tags_url) {
    var tags_url = urlt.parse(info.tags_url);
    builder.set(
      vocab.tags,
      as.collection().id(tags_url.expand({}))
    );
  }

  // TODO: Many more fields

  return builder.get();
}

module.exports = convert;
