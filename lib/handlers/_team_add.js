var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

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
