/** jshint node:true **/
'use strict';

const as     = require('activitystrea.ms');
const ld     = require('linkeddata-vocabs');
const vocab  = require('../ghvocab');
const cached = require('../models').cached;

function convert(info) {
  if (!info) {
    return null;
  }

  var builder = as.object(vocab.Release).
    id(info.url).
    set(vocab.id, info.id, {type:ld.xsd.nonNegativeInteger}).
    url(info.html_url).
    name(info.name).
    content(info.body).
    set(vocab.draft, info.draft, {type:ld.xsd.boolean}).
    set(vocab.prerelease, info.prerelease, {type:ld.xsd.boolean});

  this.timestamps(builder, info);

  if (info.author) {
    builder.attributedTo(
      this.cached_user(info.author)
    );
  }

  // tag_name different from name?
  // target_commitish
  // assets_url

  if (info.tarball_url) {
    builder.attachment(
      as.link().
        href(info.tarball_url).
        mediaType('application/x-tar')
    );
  }
  if (info.zipball_url) {
    builder.attachment(
      as.link().
         href(info.zipball_url).
         mediaType('application/zip')
    );
  }

  if (info.assets) {
    for (var n = 0, l = info.assets.length; n < l; n++) {
      builder.attachment(
        cached(assets[n].url, 'Asset', assets[n])
      );
    }
  }

  return builder.get();
}

module.exports = convert;
