const Path = require('path');
const Http = require('http');
const Url = require('url');
const Fs = require('fs')
const Qs = require('querystring');

/////////////////////////////////////////////////////////////////////////////////////////////////////////
const { assign } = Object
const now = () => new Date().toTimeString().slice(0,8)
const log = console.log.bind(console)

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

const Mim = {
  $: Object.create(null),
  get(x, fallback) {
      const ext = Path.extname(x).slice(1).toLowerCase()
      return this.$[ ext ] || fallback || 'plain/text'
    },

  set(ext, type) {
      this.$[ ext.toLowerCase() ] = type
      return this
    }
 }
;((Mim, Mims) => {
for(let type in Mims) {
      for (let types = Mims[ type ], i=0; i < types.length; i++)
        Mim.set(types[ i ], type)
      Mim.set(type, type)
    }
})(Mim, {
  "application/javascript"         : [ "js" ],
  "application/json"               : [ "json", "map" ],
  "application/octet-stream"       : [ "bin", "dms", "lrf", "mar", "so", "dist", "distz", "pkg", "bpk", "dump", "elc", "deploy", "buffer" ],
  "image/gif"                      : [ "gif" ],
  "image/jpeg"                     : [ "jpeg", "jpg", "jpe" ],
  "image/png"                      : [ "png" ],
  "image/svg+xml"                  : [ "svg", "svgz" ],
  "image/x-icon"                   : [ "ico" ],
  "text/css"                       : [ "css" ],
  "text/html"                      : [ "html", "htm" ],
  "text/plain"                     : [ "txt", "text", "conf", "def", "list", "log", "in", "ini" ]
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

class App {
  constructor() {
      this.routes = [];
    }
  queue(req, res, done) {
    let i = -1;
    const next = err => {
      const route = this.routes[++i];
      if (err || !route)
        return done.call(this, err, req, res);
      if (!route.pass(req))
        return next();
      try {
        route.cb.call(this, req, res, next);
      } catch (err) {
        err.msg = `route ${ i }`
        next(err);
      }
    }
    next();
  }
  use(method, url, cb) {
    if ('function'===typeof method)
      cb = method, method = null, url = null;
    else if ('function'===typeof url)
      cb = url, url = null;
    const terms = [];
    method && terms.unshift(req => method===req.method);
    url && terms.unshift(url instanceof RegExp ? req => url.test(req.pathname) : req => url === req.pathname);
    const pass = terms.length ? req => terms.every(fn => fn(req)) : () => !0

    this.routes.push({ pass, cb });
    return this
  }

  listen(port, done) {
      this.server = Http.createServer((req, res) => {
        assign(req, Url.parse(req.url))
        req.query = Qs.parse(req.query)
        this.queue(req, res, done)
      })
      this.server.listen(port)
      return this;
    }

  get(url, cb) {
      return this.use('GET', url, cb)
    }
  post(url, cb) {
      return this.use('POST', url, cb)
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////

function movies(req, res) {
    let { i, s, page } = req.query;
    if (!i&&!s&&!page) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      return Fs.createReadStream('./index.html').pipe(res);
    }

    Fs.readFile('./db/movies.json', (err, data) => {
      let Result, Search = mok(data), LIMIT = 10;

      if (i) {
        Result = Search.find(x => x.imdbID===i)
      } else {

        let totalResults = Search.length

        if (page=0|page) {

          let to = Math.min(totalResults, page*LIMIT),
              from = Math.max(0, to-LIMIT)

          log(from, to);
           Search = Search.slice(from, to);
        }

        Result = { totalResults, Search }
      }

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(Result))

    })
}

function mok(data, times=10) {
    let buf=[], arr = JSON.parse(data.toString())
    while(times--)
      buf.push(...arr.sort((a,b) => Math.random() > .5 ? 1 : -1))
    return buf
  }

function fin(err, req, res) {
  if (err) {
    let { name, stack, message, msg='*** NOT QUEUE ERROR ***' } = err;
    if( res.statusCode===200 )
      res.statusCode = 500

    let buf = `============================ ERROR: ${ name } ============================
      [ ${ res.statusCode } ] ${ req.method } ${ req.url }
      ${ msg }
      ${ message }
      ${ stack }`
    console.log(buf);
    res.setHeader('Content-Type', 'text/plain');
    res.end(buf)
  } else {
    res.statusCode = 200
    res.end('ok')
  }
}

function logger(...args) {
  return (req, res, next) => {
    res.once('finish', () => console.log(now(), ...args.map(k => req[ k ] || res[ k ])));
    next();
  }
}

function statiq(req, res) {
  const filename = Path.join(process.cwd(), req.pathname);
  Fs.stat(filename, function(err, stats) {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html' })
      res.end('<h1>404 Not Found....</h1>');
    }
      else {
        res.writeHead(200, {
          'Content-Length' : stats.size,
          'Content-Type': Mim.get(filename)
        })
        Fs.createReadStream(filename).pipe(res);
      }
  })
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////


const app = new App;
const PORT = 3000;

app
  .use(logger('statusCode', 'method', 'url'))
  .get('/', movies)
  .get(statiq)
  .listen(PORT, fin);

log('start movies on localhost:' + PORT);