var cached = require('../models').cached;
var as = require('activitystrea.ms');
var vocab = require('../ghvocab');

module.exports = function(info) {
  var pages = info.pages;
  var repository = info.repository;
  var sender = info.sender;

  var builder = this.builder(as.update, info.sender);

  if (pages) {
    for (var n = 0, l = pages.length; n < l; n++) {
      var page = pages[n];
      var page_builder = as.page();
      page_builder.displayName(page.title);
      page_builder.set(vocab.page_name, page.page_name);
      if (page.summary) {
        page_builder.summary(page.summary);
      }
      page_builder.set(vocab.sha, page.sha);
      page_builder.url(page.html_url);
      builder.object(page_builder);
    }
  }

  builder.context(cached(repository.url, 'Repository', repository));

  return builder.get();
};
