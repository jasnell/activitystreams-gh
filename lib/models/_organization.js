/** jshint node:true **/
'use strict';

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

function convert(org) {
  if (!org) {
    return null;
  }
  var builder = as.organization().
    id(org.url).
    set(vocab.id, org.id, {type:ld.xsd.nonNegativeInteger}).
    url(
      as.link().
        href(org.html_url).
         mediaType('text/html')
    ).
    name(org.name||org.login);
  if (org.avatar_url && org.avatar_url.length > 0) {
   builder.image(org.avatar_url);
  }
  if (org.location) {
   builder.location(
     as.place().name(org.location)
   );
  }
  if (org.email) {
   builder.url('mailto:' + org.email);
  }
  if (org.blog) {
   builder.url(
     as.link().
        href(org.blog).
        rel('weblog')
   );
  }
  if (org.company) {
    builder.set(vocab.company, org.company);
  }
  builder.set(
    vocab.public_repos,
    org.public_repos,
    {type:ld.xsd.nonNegativeInteger});
  builder.set(
    vocab.public_gists,
    org.public_gists,
    {type:ld.xsd.nonNegativeInteger});
  builder.set(
    vocab.followers,
    org.followers,
    {type:ld.xsd.nonNegativeInteger});
  builder.set(
    vocab.following,
    org.following,
    {type:ld.xsd.nonNegativeInteger});

  this.timestamps(builder, org);

  return builder.get();
}

module.exports = convert;
