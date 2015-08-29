;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var build = info.build;
  var repository = info.repository;

  return this.builder(as.announce, info.sender).
    object(cached(build.url, 'Pagebuild', build)).
    context(cached(repository.url, 'Repository', repository)).
    get();
};
