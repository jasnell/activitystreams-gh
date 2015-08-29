/** jshint node:true **/
;

const as  = require('activitystrea.ms');
const ld  = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  var builder = as.object(vocab.Tag).
    id(info.url).
    displayName(info.name || info.tag).
    set(vocab.sha, info.sha).
    summary(info.message);
  if (info.tagger) {
    var person = as.person();
    if (info.tagger.name)
      person.displayName(info.tagger.name);
    if (info.tagger.email)
      person.url('mailto:' + info.tagger.email);
    builder.attributedTo(person);
    builder.published(new Date(info.tagger.date));
  }
  if (info.object) {
    builder.context(
      as.link(vocab.Commit).
         href(info.object.url).
         set(vocab.sha, info.object.sha)
    );
  }
  return builder.get();
}

module.exports = convert;
