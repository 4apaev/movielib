'use strict';
const Fs = require('fs');
const Path = require('path');
const Mim = require('./mim');


module.exports = (basedir=process.cwd()) => (req, res) => {

  const path = Path.join(basedir, req.pathname);

  Fs.stat(path, (err, stats) => {

    if (err || !stats.isFile()) {
      res.writeHead(404, {
          'Content-Type': 'text/html'
        })
      res.end('<h1>404 Not Found....</h1>');
    }
      else {
        res.writeHead(200, {
          'Content-Length' : stats.size,
          'Content-Type': Mim.get(path)
        })
        Fs.createReadStream(path).pipe(res);
      }
  })

}