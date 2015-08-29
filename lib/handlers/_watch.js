;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var repository = info.repository;
  return this.builder(as.follow, info.sender).
    object(cached(repository.url, 'Repository', repository)).
    get();
};
