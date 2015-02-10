var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');
var ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var action = info.action;
  var issue = info.issue;
  var assignee = info.assignee;
  var label = info.label;
  var repository = info.repository;

  var builder;

  switch(action) {
    case 'assigned': {
      if (!assignee) {
        throw new Error('Invalid issue assignment - missing assignee');
      }
      builder = this.builder(as.assign, info.sender);
      builder.object(cached(assignee.url,assignee.type||'User',assignee));
      builder.target(cached(issue.url, 'Issue', issue));
      break;
    }
    case 'unassigned': {
      if (!assignee) {
        throw new Error('Invalid issue unassignment - missing assignee');
      }
      builder = this.builder(as.undo, info.sender);
      var assign = as.assign();
      assign.object(cached(assignee.url,assignee.type||'User',assignee));
      assign.target(cached(issue.url, 'Issue', issue));
      builder.object(assign);
      break;
    }
    case 'labeled':
      if (!label) {
        throw new Error('Invalid issue label - missing label');
      }
      builder = this.builder(as.add, info.sender);
      builder.object(
        as.object().
          id(label.url).
          displayName(label.name).
          set(vocab.color, label.color)
      );
      builder.target(cached(issue.url, 'Issue', issue));
      break;
    case 'unlabeled':
      if (!label) {
        throw new Error('Invalid issue label - missing label');
      }
      builder = this.builder(as.remove, info.sender);
      builder.object(
        as.object().
          id(label.url).
          displayName(label.name).
          set(vocab.color, label.color)
      );
      builder.origin(cached(issue.url, 'Issue', issue));
      break;
    case 'opened':
      builder = this.builder(as.create, info.sender);
      builder.object(cached(issue.url, 'Issue', issue));
      break;
    case 'closed':
      builder = this.builder(as.complete, info.sender);
      builder.object(cached(issue.url, 'Issue', issue));
      break;
    case 'reopened':
      builder = this.builder(as.undo, info.sender);
      var complete = as.complete();
      complete.object(cached(issue.url, 'Issue', issue));
      builder.object(complete);
      break;
  }

  var repo_key = repository.url;
  builder.context(cached(repo_key, 'Repository', repository));

  return builder.get();
};
