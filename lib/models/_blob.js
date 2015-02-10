/** jshint node:true **/

var as    = require('activitystrea.ms');
var ld    = require('linkeddata-vocabs');
var vocab = require('../ghvocab');

function convert(info) {
  if (!info) {
    return null;
  }
  return as.content().
    id(info.url).
    content(info.content).
    set(vocab.encoding, info.encoding).
    set(vocab.sha, info.sha).
    set(vocab.size, info.size).
    get();
}

module.exports = convert;
