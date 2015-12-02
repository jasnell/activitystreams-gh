'use strict';
const express     = require('express');
const handlers    = require('./handlers');
const env         = require('../config/env');
const db          = require('./db');
const as          = require('activitystrea.ms');
const url         = require('url');
const crypto      = require('crypto');
const async       = require('async');
const models      = as.models;
const xsd         = require('linkeddata-vocabs').xsd;

var store;

function rawBody(req,res,next) {
  var err;
  req.rawBody = '';
  req.setEncoding('utf8');
  req.on('data', function(chunk) {
    req.rawBody += chunk;
  });
  req.on('end', function() {
    if (!err) next();
  });
}

function signatureinvalid(signature, body) {
  if (signature && body) {
    var digest = crypto.createHmac('sha1', env.secret).
      update(body).digest('hex');
    if (signature.substr(5) != digest)
      return signature.substr(5) + ',' + digest;
  }
}

function sigcheck(req,res,next) {
  var event = req.get('x-github-event');
  var delivery = req.get('x-github-delivery');
  var signature = req.get('x-hub-signature');
  var check = signatureinvalid(signature, req.rawBody);
  if (env.secret && check) {
    res.status(400).end('Invalid Signature [' + sigcheck + ']');
  }
  if (!event) {
    res.status(400).end();
    return;
  }
  var handler = handlers[event];
  if (!handler) {
    res.status(400).end();
    return;
  }
  req.handler = handler;
  next();
}

function hook(req, res, next) {
  if (req.rawBody) {
    async.waterfall(
      [
        async.constant(req.rawBody),
        async.asyncify(JSON.parse),
        function(body, done) {
          var obj = req.handler(body);
          obj.export(function(err,obj) {
            if (err) {
              done(err);
              return;
            }
            done(null,obj);
          });
        },
        store.insert
      ],
      function(err, ok) {
        if (err) {
          res.status(500).end(err.message);
          return;
        }
        res.status(202).end();
      }
    );
  } else {
    res.status(200).end();
  }
}

function fetchcol(req, res, next) {
  var limit = Math.max(0, Math.min(200, req.query.limit || 25)) || 25;
  res.set({'Content-Type':'application/activity+json'});
  res.status(200);
  var collection = as.collection();
  var url_base = {
    protocol: 'http',
    hostname: 'asgh.mybluemix.net',
    slashes: true,
    pathname: '/page',
    query: {
      limit: limit
    }
  };

  var first = url.format(url_base);
  collection.first(first);
  collection.get().pipe(res);
}

function fetch(req,res,next) {

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
    var collection = as.collectionPage();

    var url_base = {
      protocol: 'http',
      hostname: 'asgh.mybluemix.net',
      slashes: true,
      pathname: '/page',
      query: {
        limit: limit
      }
    };
    var first = url.format(url_base);
    var nextPage;
    collection.first(first);

    if (results.total_rows > results.rows.length &&
        results.rows.length >= limit) {
      var next_url = Object.create(url_base);
      next_url.query = {
        limit: limit,
        bookmark: results.bookmark
      };
      nextPage = url.format(next_url);
      collection.next(nextPage);
    }
    var links = {
      first: first
    };
    if (nextPage) links.next = nextPage;
    res.links(links);

    async.forEachOf(results.rows, function(item, key, callback) {
      as.import(item.doc, function(err,obj) {
        if (err) {
          callback(err);
          return;
        }
        collection.items(obj);
        callback();
      });
    }, function(err) {
      if (err) {
        res.status(500).end(err.message);
        return;
      }
      res.set({'Content-Type':'application/activity+json'});
      res.status(200);
      collection.get().pipe(res, {
        additional_context: {
          'gh': 'https://api.github.com/#',
          'gh-id': {
            '@id': 'gh:id',
            '@type': xsd.nonNegativeInteger
          },
          'gh-number': {
            '@id': 'gh:number',
            '@type': xsd.nonNegativeInteger
          },
          'gh-fork': {
            '@id': 'gh:fork',
            '@type': xsd.boolean
          },
          'gh-private': {
            '@id': 'gh:private',
            '@type': xsd.boolean
          },
          'gh-branches': 'gh:branches',
          'gh-events': 'gh:events',
          'gh-forks': 'gh:forks',
          'gh-tags': 'gh:tags'
        }
      });
    });
  });
}

function errhandler(err,req,res,next) {
  res.status(500).end(err.message);
}

db(env, 'github', function(err,storage) {
  store = storage;
  var app = express();
  if (err) {
    app.get('/', function(req,res) {
      res.status(500).end(err);
    });
  } else {
    app.post('/', rawBody, sigcheck, hook, errhandler);
    app.get('/', fetchcol, errhandler);
    app.get('/page', fetch, errhandler);
  }
  app.listen(env.listenPort, env.listenHost);
  console.log('App started on port ' + env.listenPort);
});
