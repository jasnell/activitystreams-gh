;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var repository = info.repository;
  var organization = info.organization;
  return this.builder(as.add, info.sender).
    object(cached(repository.url, 'Repository', repository)).
    target(cached(organization.url, 'Organization', organization)).
    get();
};
