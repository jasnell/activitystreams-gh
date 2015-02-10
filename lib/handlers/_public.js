var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var repository = info.repository;
  return this.builder(as.announce, info.sender).
    object(cached(repository.url, 'Repository', repository)).
    get();
};
