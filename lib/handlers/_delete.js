var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');

module.exports = function(info) {
  var ref = info.ref;
  var ref_type = info.ref_type;
  var repo = info.repository;
  var sender = info.sender;

  var builder = this.builder(as.remove, info.sender);

  var repo_key = repo.url;
  var ref_id = repo_key;
  var object_type;
  switch(ref_type) {
    case 'tag':
      ref_id += '/tags/' + ref;
      object_type = vocab.Tag;
      break;
    case 'branch':
      ref_id += '/branches/' + ref;
      break;
    default:
      throw new Error('Unsupported ref type: ' + ref_type);
  }
  builder.object(
    as.object(object_type).
       id(ref_id)
  );

  builder.origin(cached(repo_key, 'Repository', repo));

  return builder.get();
};
