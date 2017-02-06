'use strict';

global.log = console.log.bind(console)

const App = require('./server')
const cors = require('./server/middleware/cors')
const logger = require('./server/middleware/logger')
const statiq = require('./server/middleware/static')
const finish = require('./server/middleware/finish')

const app = new App;
const PORT = 3000;

const movies = require('./routes/movies')

app
  .use(logger('statusCode', 'method', 'url'))
  .use(cors)

  .get('/', movies)

  .get(statiq())
  .listen(PORT, finish);

log('start movies on localhost:' + PORT)
