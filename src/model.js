'use strict';

const total = Symbol('total');
const limit = Symbol('limit');
const current = Symbol('current');
const isInt = x => x === (0 | x);

module.exports = {
  [ URL ]: 'http://www.omdbapi.com/',
  [ total ]: 0,
  [ limit ]: 10,
  [ current ]: 0,

  results: [],
  search: 'Cowboy Bebop',

  fetch(search) {
    if ('string'===typeof search)
      this.search = search

    return fetch(`${ this[ URL ] }?s=${ this.search }&page=${ this.page }`)
              .then(x => x.json())
              .then(x => {
                this.total = +x.totalResults
                return this.results = x.Search
              })
    },

  details(id) {
      return fetch(`${ this[ URL ] }?i=${ id }&plot=full`)
              .then(x => x.json())
    },

  get total() {
      return this[ total ];
    },
  set total(n)   {
      if (isInt(n) && n > -1)
        this[ total ] = n;
    },

  get limit() {
      return this[ limit ];
    },
  set limit(n)   {
      if (isInt(n) && n > 0)
        this[ limit ] = n;
    },

  get current() {
      return this[ current ];
    },
  set current(n) {
      if (isInt(n)
        && n >= 0
        && n <= this.total)
        this[ current ] = n;
    },

  get page() {
      return 1 + (0|this.current/this.limit);
    },

  next() {
      this.current += this.limit;
      return this;
    },

  prev() {
      this.current -= this.limit;
      return this;
    },

  reset() {
      this.total = 0;
      this.limit = 10;
      this.current = 0;
      this.results = [];
      return this;
    }
}
