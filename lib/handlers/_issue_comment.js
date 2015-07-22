
var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var issue = info.issue;
  var comment = info.comment;
  var repository = info.repository;

  var options = {
    event: 'issue_comment',
    issue: issue,
    repository: repository
  };

  return this.builder(as.add, info.sender).
    object(cached(comment.url, 'Comment', [comment, options])).
    target(cached(issue.url, 'Issue', issue)).
    context(cached(repository.url, 'Repository', repository)).
    get();
};
