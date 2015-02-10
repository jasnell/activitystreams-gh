var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var member = info.member;
  var organization = info.organization;
  var team = info.team;

  return this.builder(as.add, info.sender).
    object(cached(member.url, member.type||'User', member)).
    target(cached(team.url, 'Team', team)).
    context(cached(organization.url, 'Organization', organization)).
    get();
};
