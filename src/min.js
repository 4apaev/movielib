(($, TITLES, TOTAL, LIMIT, CURRENT, URL, ...KEYS) => {

  const isInt = x => x === (0 | x);
  const Model = {
    [ LIMIT ]: 10,
    [ TOTAL ]: 0,
    [ CURRENT ]: 0,
    results: [],
    search: 'Cowboy Bebop',

    details(id) {
        return fetch(`${ URL }?i=${ id }&plot=full`)
                    .then(x => x.json())
      },

    fetch(search) {
      if ('string' === typeof search)
        this.search = search

      return fetch(`${ URL }?s=${ encodeURIComponent(this.search) }&page=${ this.page }`)
        .then(x => x.json())
        .then(x => {
          this.total = +x.totalResults
          return this.results = x.Search
        })
    },

    next() {
      this.current += this.limit
      return this;
    },

    prev() {
      this.current -= this.limit
      return this;
    },

    reset() {
        return this.total=0, this.limit=10, this.current=0, this.results=[], this
      },

    get total() {
        return this[ TOTAL ]
      },
    get limit() {
        return this[ LIMIT ]
      },
    get current() {
        return this[ CURRENT ]
      },
    get page() {
        return 1 + (0 | this.current / this.limit)
      },

    set total(n) {
        if (isInt(n) && n > -1)
          this[ TOTAL ] = n
      },
    set limit(n) {
        if (isInt(n) && n > 0)
          this[ LIMIT ] = n
      },
    set current(n) {
        if (isInt(n) && n >= 0 && n <= this.total)
          this[ CURRENT ] = n
      }
  }

  const Tmpl = {
    option: value => `<option value="${ value }">`,

    movie: ({ Title, Year, imdbID, Type, Poster }) => `<li>
      <div id=${ imdbID } class=img ${ Poster==='n/a' ? '' : `style="background-image: url(${ Poster });"` }></div>
      <h3>${ Title }</h3>
      <i>year: ${ Year }</i>
      <i>type: ${ Type }</i>
    </li>`,

    details: movie => `<div id=popup>
      <button id=close>✖</button>
      <img src="${ movie.Poster }">
      <dl>${ KEYS.map(key => `<dt>${ key }</dt><dd>${ movie[ key ] }</dd>`).join('') }</dl>
      <p>${ movie.Plot }</p>
    </div>`
  }

  function render(results) {
    const n = results.length,
          ul = $('results'),
          list = $('movies'),
          html = Array(n)

    for (let movie, i = 0; i < n; i++) {
      let { Title } = (movie = results[ i ])
      if (!TITLES.has(Title)) {
        TITLES.add(Title)
        list.insertAdjacentHTML('beforeEnd', Tmpl.option(Title))
      }
      html[ i ] = Tmpl.movie(movie);
    }
    ul.innerHTML = html.join('')
    setTimeout(() => $results.classList.remove('spin'), 500)
  }

  function fail(err) {
      const results = $('results')
      results.innerHTML = 'Oops... Something went wrong.'
      results.classList.remove('spin')
    }

  function Fetch(model, ...args) {
    $('results').classList.add('spin')
    model.fetch(...args).then(render).catch(fail)
  }

  function onClick({ target }) {
    if (target.matches('#next'))
      Fetch(Model.next())

    else if (target.matches('#prev'))
      Fetch(Model.prev())

    else if (target.matches('#close'))
      target.parentElement.remove()

    else if (target.matches('.img'))
      Model.details(target.id)
        .then(movie => document.body.insertAdjacentHTML('beforeEnd', Tmpl.details(movie)))
  }

  function onChange({ target }) {
      target.matches('#search')
        && Fetch(Model.reset(), target.value)
    }

  document.addEventListener('DOMContentLoaded', function init() {
      document.body.addEventListener('click', onClick, false)
      document.body.addEventListener('change', onChange, false)
      document.removeEventListener('DOMContentLoaded', init)
    })

})(document.getElementById.bind(document),
  new Set,
  Symbol('TOTAL'),
  Symbol('LIMIT'),
  Symbol('CURRENT'),
  'http://www.omdbapi.com/',
  'Title','Awards','Actors','Writer','Genre','Runtime','Director','Released','imdbRating')
