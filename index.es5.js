'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = require('path');
var Http = require('http');
var Url = require('url');
var Fs = require('fs');
var Qs = require('querystring');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
var assign = Object.assign;

var now = function now() {
  return new Date().toTimeString().slice(0, 8);
};
var log = console.log.bind(console);

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var Mim = {
  $: Object.create(null),
  get: function get(x, fallback) {
    var ext = Path.extname(x).slice(1).toLowerCase();
    return this.$[ext] || fallback || 'plain/text';
  },
  set: function set(ext, type) {
    this.$[ext.toLowerCase()] = type;
    return this;
  }
};(function (Mim, Mims) {
  for (var type in Mims) {
    for (var types = Mims[type], i = 0; i < types.length; i++) {
      Mim.set(types[i], type);
    }Mim.set(type, type);
  }
})(Mim, {
  "application/javascript": ["js"],
  "application/json": ["json", "map"],
  "application/octet-stream": ["bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "buffer"],
  "image/gif": ["gif"],
  "image/jpeg": ["jpeg", "jpg", "jpe"],
  "image/png": ["png"],
  "image/svg+xml": ["svg", "svgz"],
  "image/x-icon": ["ico"],
  "text/css": ["css"],
  "text/html": ["html", "htm"],
  "text/plain": ["txt", "text", "conf", "def", "list", "log", "in", "ini"]
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var App = function () {
  function App() {
    _classCallCheck(this, App);

    this.routes = [];
  }

  _createClass(App, [{
    key: 'queue',
    value: function queue(req, res, done) {
      var _this = this;

      var i = -1;
      var next = function next(err) {
        var route = _this.routes[++i];
        if (err || !route) return done.call(_this, err, req, res);
        if (!route.pass(req)) return next();
        try {
          route.cb.call(_this, req, res, next);
        } catch (err) {
          err.msg = 'route ' + i;
          next(err);
        }
      };
      next();
    }
  }, {
    key: 'use',
    value: function use(method, url, cb) {
      if ('function' === typeof method) cb = method, method = null, url = null;else if ('function' === typeof url) cb = url, url = null;
      var terms = [];
      method && terms.unshift(function (req) {
        return method === req.method;
      });
      url && terms.unshift(url instanceof RegExp ? function (req) {
        return url.test(req.pathname);
      } : function (req) {
        return url === req.pathname;
      });
      var pass = terms.length ? function (req) {
        return terms.every(function (fn) {
          return fn(req);
        });
      } : function () {
        return !0;
      };

      this.routes.push({ pass: pass, cb: cb });
      return this;
    }
  }, {
    key: 'listen',
    value: function listen(port, done) {
      var _this2 = this;

      this.server = Http.createServer(function (req, res) {
        assign(req, Url.parse(req.url));
        req.query = Qs.parse(req.query);
        _this2.queue(req, res, done);
      });
      this.server.listen(port);
      return this;
    }
  }, {
    key: 'get',
    value: function get(url, cb) {
      return this.use('GET', url, cb);
    }
  }, {
    key: 'post',
    value: function post(url, cb) {
      return this.use('POST', url, cb);
    }
  }]);

  return App;
}();

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function movies(req, res) {
  var _req$query = req.query;
  var i = _req$query.i;
  var s = _req$query.s;
  var page = _req$query.page;

  if (!i && !s && !page) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return Fs.createReadStream('./index.html').pipe(res);
  }

  Fs.readFile('./db/movies.json', function (err, data) {
    var Result = void 0,
        Search = mok(data),
        LIMIT = 10;

    if (i) {
      Result = Search.find(function (x) {
        return x.imdbID === i;
      });
    } else {

      var totalResults = Search.length;

      if (page = 0 | page) {

        var to = Math.min(totalResults, page * LIMIT),
            from = Math.max(0, to - LIMIT);

        log(from, to);
        Search = Search.slice(from, to);
      }

      Result = { totalResults: totalResults, Search: Search };
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(Result));
  });
}

function mok(data) {
  var times = arguments.length <= 1 || arguments[1] === undefined ? 10 : arguments[1];

  var buf = [],
      arr = JSON.parse(data.toString());
  while (times--) {
    buf.push.apply(buf, _toConsumableArray(arr.sort(function (a, b) {
      return Math.random() > .5 ? 1 : -1;
    })));
  }return buf;
}

function fin(err, req, res) {
  if (err) {
    var name = err.name;
    var stack = err.stack;
    var message = err.message;
    var _err$msg = err.msg;
    var msg = _err$msg === undefined ? '*** NOT QUEUE ERROR ***' : _err$msg;

    if (res.statusCode === 200) res.statusCode = 500;

    var buf = '============================ ERROR: ' + name + ' ============================\n      [ ' + res.statusCode + ' ] ' + req.method + ' ' + req.url + '\n      ' + msg + '\n      ' + message + '\n      ' + stack;
    console.log(buf);
    res.setHeader('Content-Type', 'text/plain');
    res.end(buf);
  } else {
    res.statusCode = 200;
    res.end('ok');
  }
}

function logger() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return function (req, res, next) {
    res.once('finish', function () {
      var _console;

      return (_console = console).log.apply(_console, [now()].concat(_toConsumableArray(args.map(function (k) {
        return req[k] || res[k];
      }))));
    });
    next();
  };
}

function statiq(req, res) {
  var filename = Path.join(process.cwd(), req.pathname);
  Fs.stat(filename, function (err, stats) {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found....</h1>');
    } else {
      res.writeHead(200, {
        'Content-Length': stats.size,
        'Content-Type': Mim.get(filename)
      });
      Fs.createReadStream(filename).pipe(res);
    }
  });
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var app = new App();
var PORT = 3000;

app.use(logger('statusCode', 'method', 'url')).get('/', movies).get(statiq).listen(PORT, fin);

log('start movies on localhost:' + PORT);
