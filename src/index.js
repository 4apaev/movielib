'use strict';

const $ = document.getElementById.bind(document)
const Tmpl = require('./templates')
const Model = require('./model')
const titles = [];

function render(results) {
    const n = results.length,
          html = Array(n),
          list = $('movies'),
          ul = $('results')

    for (let movie, i=0; i < n; i++) {
      html[ i ] = Tmpl.movie(movie = results[ i ]);

      if (titles.indexOf(movie.Title)===-1) {
        titles.push(movie.Title)

        list.insertAdjacentHTML('beforeEnd', Tmpl.option(movie.Title));
      }
    }

    ul.innerHTML = html.join('')
    return results
  }

function Fetch(model, ...args) {
    const results = $('results');
    results.classList.add('spin');

    model.fetch(...args)
          .then(render)
          .then(() => {
            setTimeout(results.classList.remove.bind(results.classList), 1000, 'spin');
          })
          .catch(err => {
              results.innerHTML = 'Oops... Something went wrong.'
              results.classList.remove('spin');
            });
  }


const onChange = e => e.target.matches('#search') && Fetch(Model.reset(), e.target.value);
const onClick = e => {

  if (e.target.matches('#next'))
    Fetch(Model.next())

  else if (e.target.matches('#prev'))
    Fetch(Model.prev())

  else if (e.target.matches('#close'))
    e.target.parentElement.remove()

  else if (e.target.matches('.img'))
    Model.details(e.target.id)
      .then(movie => {
            document.body.insertAdjacentHTML('beforeEnd', Tmpl.details(movie));
          });
}




module.exports = function init(el) {
  el.addEventListener('click', onClick, false)
  el.addEventListener('change', onChange, false)
}