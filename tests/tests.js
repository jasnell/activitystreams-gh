var assert = require('assert');
var fs = require('fs');
var path = require('path');
var handlers = require('../lib/handlers');

var data_dir = './tests/data/';

fs.readdir(data_dir, function(err, list) {

  list.forEach(function(item) {

    if (item) {
      var name = path.parse(item).name;
      var handler = handlers[name];
      if (handler) {
        fs.readFile(data_dir + item, function(err, file) {
          var json = JSON.parse(file);
          assert.doesNotThrow(function() {
            handler(json);
          });
        });
      }
    }

  });

});
