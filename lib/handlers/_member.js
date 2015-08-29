;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var member = info.member;
  var repository = info.repository;
  var sender = info.sender;

  return this.builder(as.add, info.sender).
    object(cached(member.url, member.type||'User', member)).
    target(cached(repository.url, 'Repository', repository)).
    get();
};
