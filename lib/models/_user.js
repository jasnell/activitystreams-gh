/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

function convert(user) {
  if (!user) {
    return null;
  }
  var builder = as.person().
    id(user.url).
    set(vocab.id, user.id, {type:ld.xsd.nonNegativeInteger}).
    url(
      as.link().
         href(user.html_url).
         mediaType('text/html')
    ).
    displayName(user.name||user.login);
  if (user.avatar_url && user.avatar_url.length > 0) {
   builder.image(user.avatar_url);
  }
  if (user.location) {
   builder.location(
     as.place().displayName(user.location)
   );
  }
  if (user.email) {
   builder.url('mailto:' + user.email);
  }
  if (user.blog) {
   builder.url(
     as.link().
        href(user.blog).
        rel('weblog')
   );
  }
  if (user.company) {
    builder.set(vocab.company, user.company);
  }
  builder.set(
    vocab.public_repos,
    user.public_repos,
    {type:ld.xsd.nonNegativeInteger});
  builder.set(
    vocab.public_gists,
    user.public_gists,
    {type:ld.xsd.nonNegativeInteger});
  builder.set(
    vocab.followers,
    user.followers,
    {type:ld.xsd.nonNegativeInteger});
  builder.set(
    vocab.following,
    user.following,
    {type:ld.xsd.nonNegativeInteger});

  this.timestamps(builder, this);

  return builder.get();
}

module.exports = convert;
