'use strict';

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var release = info.release;
  var repository = info.repository;
  return this.builder(as.add, info.sender).
    object(cached(release.url, 'Release', release)).
    target(cached(repository.url, 'Repository', repository)).
    get();
};
