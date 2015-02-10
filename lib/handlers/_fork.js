var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');

module.exports = function(info) {
  var forkee = info.forkee;
  var repository = info.repository;
  return this.builder(as.activity, info.sender, vocab.Fork).
    origin(cached(forkee.url, 'Repository', forkee)).
    target(cached(repository.url, 'Repository', repository)).
    get();
};
