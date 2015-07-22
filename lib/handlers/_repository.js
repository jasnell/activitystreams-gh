var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var repository = info.repository;
  var organization = info.organization;
  return this.builder(as.add, info.sender).
    object(cached(repository.url, 'Repository', repository)).
    target(cached(organization.url, 'Organization', organization)).
    get();
};
