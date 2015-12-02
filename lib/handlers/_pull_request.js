'use strict';

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const gh = require('../ghvocab');
const vocab = require('../ghvocab');
const ld = require('linkeddata-vocabs');

module.exports = function(info) {
  var action = info.action;
  var number = info.number;
  var pr = info.pull_request;
  var assignee = info.assignee;
  var label = info.label;
  var repository = info.repository;

  var builder;

  var pullrequest = cached(pr.url, 'PullRequest', pr);

  switch(action) {
    case 'assigned':
      builder = this.builder(as.assign, info.sender);
      builder.object(cached(assignee.url,assignee.type||'User',assignee));
      builder.target(pullrequest);
      break;
    case 'unassigned':
      builder = this.builder(as.undo, info.sender);
      var assign = as.assign();
      assign.object(cached(assignee.url,assignee.type||'User',assignee));
      assign.target(pullrequest);
      builder.object(assign);
      break;
    case 'labeled':
      builder = this.builder(as.add, info.sender);
      if (!label) {
        throw new Error('Invalid pr label - missing label');
      }
      builder.object(
        as.object().
          id(label.url).
          name(label.name).
          set(vocab.color, label.color)
      );
      builder.target(cached(issue.url, 'Issue', issue));
      break;
    case 'unlabeled':
      builder = this.builder(as.remove, info.sender);
      if (!label) {
        throw new Error('Invalid pr label - missing label');
      }
      builder.object(
        as.object().
          id(label.url).
          name(label.name).
          set(vocab.color, label.color)
      );
      builder.origin(cached(issue.url, 'Issue', issue));
      break;
    case 'opened':
      builder = this.builder(as.create, info.sender);
      builder.object(pullrequest);
      break;
    case 'closed':
      builder = this.builder(as.activity, info.sender, [gh.Complete]);
      builder.object(pullrequest);
      break;
    case 'reopened':
      builder = this.builder(as.undo, info.sender);
      var complete = as.activity([gh.Complete]);
      complete.object(pullrequest);
      builder.object(complete);
      break;
    case 'synchronize':
      builder = this.builder(as.update, info.sender);
      builder.object(pullrequest);
      break;
  }

  builder.context(cached(repository.url, 'Repository', repository));

  return builder.get();
};
