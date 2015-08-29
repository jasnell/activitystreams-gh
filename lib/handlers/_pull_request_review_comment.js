;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var pull_request = info.pull_request;
  var comment = info.comment;
  var repository = info.repository;

  var options = {
    event: 'pull_request_review_comment',
    pull_request: pull_request,
    repository: repository
  };

  return this.builder(as.add, info.sender).
    object(cached(comment.url, 'Comment', [comment, options])).
    target(cached(pull_request.url, 'PullRequest', pull_request)).
    context(cached(repository.url, 'Repository', repository)).
    get();
};
