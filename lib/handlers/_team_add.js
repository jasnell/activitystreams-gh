;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var team = info.team;
  var repository = info.repository;
  var organization = info.organization;

  var builder = this.builder(as.add, info.sender);

  builder.object(cached(repository.url, 'Repository', repository));

  builder.target(cached(team.url, 'Team', team));

  builder.context(cached(organization.url, 'Organization', organization));

  return builder.get();
};
