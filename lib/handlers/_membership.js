;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

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
