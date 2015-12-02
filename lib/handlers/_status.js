'use strict';

const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');
const models = require('../models');
const cached = models.cached;

module.exports = function(info) {
  var repository = info.repository;
  var commit = info.commit;

  var builder = this.builder(as.add, info.sender);

  builder.object(models.Status(info));

  builder.target(cached(commit.url, 'Commit', commit));

  builder.context(cached(repository.url, 'Repository', repository));

  return builder.get();
};
