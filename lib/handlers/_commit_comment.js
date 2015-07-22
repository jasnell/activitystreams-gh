var cached = require('../models').cached;
var as = require('activitystrea.ms');

module.exports = function(info) {

  var comment = info.comment;
  var repository = info.repository;

  var options = {
    event: 'commit_comment',
    repository: repository
  };

  var ret = this.builder(as.add, info.sender).
    object(cached(comment.url, 'Comment', [comment, options])).
    target(cached(repository.url, 'Repository', repository)).
    get();

  return ret;

};
