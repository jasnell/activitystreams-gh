;

const cached = require('../models').cached;
const as = require('activitystrea.ms');
const vocab = require('../ghvocab');

module.exports = function(info) {
  var ref = info.ref;
  var ref_type = info.ref_type;
  var master_branch = info.master_branch;
  var description = info.description;
  var pusher_type = info.pusher_type;
  var repo = info.repository;

  var builder = this.builder(as.add, info.sender);

  if (description) {
    builder.summary(description);
  }

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

  builder.target(cached(repo_key, 'Repository', repo));

  return builder.get();
};
