const Fs = require('fs')
const path = './db/movies.json'
const html = './index.html'
const ID = 'imdbID'
const LIMIT = 10;


module.exports = movies
function movies(req, res) {

    let { i, s, page } = req.query;

    if (!i&&!s&&!page) {
      res.writeHead(200, { 'Content-Type': 'text/html' })
      return Fs.createReadStream(html).pipe(res);
    }

    Fs.readFile(path, (err, data) => {

      let Result, Search = mok(data);

      if (i) {
        Result = Search.find(x => x[ ID ]===i)
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