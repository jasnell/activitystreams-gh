
var express     = require('express');
var body_parser = require('body-parser');
var handlers    = require('./handlers');
var env         = require('../config/env');
var db          = require('./db');
var as          = require('activitystrea.ms');
var url         = require('url');
var crypto      = require('crypto');
var models      = as.models;

rawBody = function rawBody(req,res,next) {
  var err;
  req.rawBody = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function() {
    if (!err) next();
  });
};

db(env, 'github', function(err,store) {
  if (err) {
    console.log(err);
    return;
  }

  function signatureinvalid(signature, body) {
    if (signature && body) {
      var digest = crypto.createHmac('sha1', env.secret).
        update(body).digest('hex');
      if (signature.substr(5) != digest)
        return signature.substr(5) + ',' + digest;
    }
  }

  var hook = function(req, res, next) {
    try {
      var event = req.get('x-github-event');
      var delivery = req.get('x-github-delivery');
      var signature = req.get('x-hub-signature');

      var sigcheck = signatureinvalid(signature, req.rawBody);
      if (env.secret && sigcheck) {
        res.status(400).end('Invalid Signature [' + sigcheck + ']');
      }

      var body = JSON.parse(req.rawBody);

      if (!event) {
        res.status(400).end();
        return;
      }

      var handler = handlers[event];
      if (!handler) {
        res.status(400).end();
        return;
      }

      if (body) {
        store.insert(handler(body)._expanded, function(err,body) {
          if (err) {
            res.status(500).end(err.message);
            return;
          }
          res.status(202).end();
        });
      } else {
        res.status(200).end();
      }
    } catch (err) {
      res.send(500).end(err.message);
    }
  };

  var app = new express();
  //app.use(body_parser.json());
  app.use(rawBody);

  app.post('/', hook);

  app.get('/', function(req,res,next) {

    var limit = Math.max(0, Math.min(200, req.query.limit || 25)) || 25;
    var bookmark = req.query.bookmark;

    var options = {
      q: 'published:[1 TO Infinity]',
      sort: '["-published"]',
      include_docs: true,
      limit: limit
    };
    if (bookmark) options.bookmark = bookmark;

    store.search('search','main',options,function(err,results) {
      if (err) {
        res.status(500).end(err.message);
        return;
      }
      var collection = as.collection();

      var url_base = {
        protocol: 'http',
        hostname: 'asgh.mybluemix.net',
        slashes: true,
        pathname: '/',
        query: {
          limit: limit
        }
      };
      var first = url.format(url_base);
      var next;
      collection.first(first);

      if (results.total_rows > results.rows.length &&
          results.rows.length >= limit) {
        var next_url = Object.create(url_base);
        next_url.query = {
          limit: limit,
          bookmark: results.bookmark
        };
        next = url.format(next_url);
        collection.next(next);
      }
      var links = {
        first: first
      };
      if (next) links.next = next;
      res.links(links);

      for (var n = 0, l = results.rows.length; n < l; n++) {
        var row = results.rows[n];
        collection.items(
          models.wrap_object(row.doc, collection._reasoner)
        );
      }
      collection.get().write(function(err,doc) {
        res.set({
          'Content-Type': 'application/activity+json'
        });
        res.status(200).end(doc, 'utf-8');
      });
    });
  });

  app.listen(env.listenPort, env.listenHost);
  console.log('App started on port ' + env.listenPort);

});
