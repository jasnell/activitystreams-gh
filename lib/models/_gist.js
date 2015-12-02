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
  var builder = as.object(vocab.Gist).
    id(info.url).
    url(info.html_url).
    set(vocab.id, info.id).
    name(vocab.description).
    set(vocab.public, info.public, {type:ld.xsd.boolean});

  if (info.owner) {
    builder.attributedTo(
      this.cached_user(info.owner)
    );
  }

  // user ?

  if (info.files) {
    var keys = Object.keys(info.files);
    for (var n = 0, l = keys.length; n < l; n++) {
      var file = info.files[keys[n]];
      builder.attachment(
        as.link().
          name(keys[n]).
          href(file.raw_url).
          mediaType(file.type).
          set(vocab.size, file.size).
          set(vocab.language, file.language)
      );
    }
  }

  builder.replies(
    as.collection().
      totalItems(info.comments).
      id(info.comments_url)
  );

  if (info.forks_url) {
    builder.url(
      as.link().
         href(info.forks_url).
         ref('forks')
    );
  }

  if (info.commits_url) {
    builder.url(
      as.link().
         href(info.commits_url).
         ref('commits')
    );
  }

  if (info.git_pull_url) {
    builder.url(
      as.link().
         href(info.git_pull_url).
         ref('git_pull')
    );
  }

  if (info.git_push_url) {
    builder.url(
      as.link().
         href(info.git_push_url).
         ref('git_push')
    );
  }

  this.timestamps(builder, info);

  return builder.get();
}

module.exports = convert;
