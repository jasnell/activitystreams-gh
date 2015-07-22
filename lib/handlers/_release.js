var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var release = info.release;
  var repository = info.repository;
  return this.builder(as.add, info.sender).
    object(cached(release.url, 'Release', release)).
    target(cached(repository.url, 'Repository', repository)).
    get();
};
