/** jshint node:true **/
'use strict';

const as    = require('activitystrea.ms');
const ld    = require('linkeddata-vocabs');
const vocab = require('../ghvocab');

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
