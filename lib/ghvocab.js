/** jshint node:true **/
;

const ns = 'https://api.github.com/#';

function define(key, iri) {
  Object.defineProperty(exports, key, {
    configurable: false,
    enumerable: true,
    value: iri
  });
}

define('ns', ns);
define('prefix', 'gh');

[
  'Repository', 'Tag', 'Branch', 'Commit',
  'Tree', 'PageBuild', 'Status', 'CombinedStatus',
  'Release', 'Hook', 'Content', 'Submodule', 'Symlink',
  'Issue', 'Milestone', 'Reference', 'PullRequest',
  'Gist', 'Fork', 'Push', 'PushSummary', 'Complete',

  'private', 'fork', 'forks', 'parent', 'source',
  'events', 'branches', 'tags', 'following',
  'followers', 'public_repos', 'public_gists',
  'company', 'id', 'tree', 'path', 'position',
  'line', 'status', 'state', 'context', 'sha',
  'draft', 'prerelease', 'size', 'downloadCount',
  'active', 'events', 'number', 'color', 'assignee',
  'milestone', 'closed', 'open_issues', 'closed_issues',
  'due', 'encoding', 'committer', 'mode', 'type',
  'truncated', 'merged', 'ref', 'public', 'language',
  'master', 'page_name', 'before', 'after', 'created',
  'deleted', 'forced', 'base_ref', 'head_commit'
].forEach(function(key) {
  define(key, ns + key);
});
