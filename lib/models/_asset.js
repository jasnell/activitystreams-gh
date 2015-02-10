/** jshint node:true **/

var as     = require('activitystrea.ms');
var ld     = require('linkeddata-vocabs');
var vocab  = require('../ghvocab');
var cached = require('../models').cached;

function convert(info) {
  if (!info) return null;
  var link = as.link().
    id(info.url).
    href(info.browser_download_url).
    set(vocab.id, info.id).
    displayName(info.name).
    title(info.label).
    set(vocab.state, info.state).
    mediaType(info.content_type).
    set(
      vocab.size,
      info.size,
      {type:ld.xsd.nonNegativeInteger}).
    set(
      vocab.downloadCount,
      info.download_count,
      {type:ld.xsd.nonNegativeInteger});
  if (info.uploader) {
    link.set(
      as.vocabs.as.attributedTo,
      this.cached_user(info.uploader)
    );
  }
  return link.get();
}

module.exports = convert;
