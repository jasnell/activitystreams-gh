var assert = require('assert');
var fs = require('fs');
var path = require('path');
var handlers = require('../lib/handlers');
var async = require('async');
var path = require('path');

describe('Conversion', function(done) {
  it('should work', function (done) {
    var dir = path.resolve(__dirname, 'data');
    fs.readdir(dir, function(err, list) {
      async.forEachOf(list, function(item, key, callback){
          var name = path.parse(item).name;
          var handler = handlers[name];
          if (handler) {
            fs.readFile(path.resolve(dir,item), function(err, file) {
              var json = JSON.parse(file);
              assert.doesNotThrow(function() {
                handler(json);
              });
            });
          }
        callback();
      }, function() {
        done();
      });
    });
  });
});
