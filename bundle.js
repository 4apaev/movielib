(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const init = require('./src/index')

document.addEventListener('DOMContentLoaded', function ready() {
  init(document.body);
  document.removeEventListener('DOMContentLoaded', ready);
})



},{"./src/index":2}],2:[function(require,module,exports){
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
},{"./model":3,"./templates":4}],3:[function(require,module,exports){
'use strict';

const total = Symbol('total');
const limit = Symbol('limit');
const current = Symbol('current');
const isInt = x => x === (0 | x);

module.exports = {
  // [ URL ]: 'http://www.omdbapi.com/',
  [ URL ]: 'http://localhost:3000/',
  [ total ]: 0,
  [ limit ]: 10,
  [ current ]: 0,

  results: [],
  search: 'Cowboy Bebop',

  fetch(search) {
    if ('string'===typeof search)
      this.search = search

    return fetch(`${ this[ URL ] }?s=${ encodeURIComponent(this.search) }&page=${ this.page }`)
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

},{}],4:[function(require,module,exports){
const keys = 'Title,Awards,Actors,Writer,Genre,Runtime,Director,Released,imdbRating'.split(',')

exports.details = movie => `
      <div id=popup>
        <button id=close>✖</button>
        <img src="${ movie.Poster }">
        <dl>
          ${ keys.map(key => `<dt>${ key }</dt><dd>${ movie[ key ] }</dd>`).join('') }
        </dl>
        <p>${ movie.Plot }</p>
      </div>`

exports.movie = ({ Title, Year, imdbID, Type, Poster }) => `
    <li>
      <div id=${ imdbID } class=img ${ Poster==='n/a' ? '' : `style="background-image: url(${ Poster });"` }></div>
      <h3>${ Title }</h3>
      <i>year: ${ Year }</i>
      <i>type: ${ Type }</i>
    </li>`

exports.option = value => `<option value="${ value }">`
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy5ucG0tcGFja2FnZXMvbGliL25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtYWluLmpzIiwic3JjL2luZGV4LmpzIiwic3JjL21vZGVsLmpzIiwic3JjL3RlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjb25zdCBpbml0ID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKVxuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gcmVhZHkoKSB7XG4gIGluaXQoZG9jdW1lbnQuYm9keSk7XG4gIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCByZWFkeSk7XG59KVxuXG5cbiIsIid1c2Ugc3RyaWN0JztcblxuY29uc3QgJCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkLmJpbmQoZG9jdW1lbnQpXG5jb25zdCBUbXBsID0gcmVxdWlyZSgnLi90ZW1wbGF0ZXMnKVxuY29uc3QgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJylcbmNvbnN0IHRpdGxlcyA9IFtdO1xuXG5mdW5jdGlvbiByZW5kZXIocmVzdWx0cykge1xuICAgIGNvbnN0IG4gPSByZXN1bHRzLmxlbmd0aCxcbiAgICAgICAgICBodG1sID0gQXJyYXkobiksXG4gICAgICAgICAgbGlzdCA9ICQoJ21vdmllcycpLFxuICAgICAgICAgIHVsID0gJCgncmVzdWx0cycpXG5cbiAgICBmb3IgKGxldCBtb3ZpZSwgaT0wOyBpIDwgbjsgaSsrKSB7XG4gICAgICBodG1sWyBpIF0gPSBUbXBsLm1vdmllKG1vdmllID0gcmVzdWx0c1sgaSBdKTtcblxuICAgICAgaWYgKHRpdGxlcy5pbmRleE9mKG1vdmllLlRpdGxlKT09PS0xKSB7XG4gICAgICAgIHRpdGxlcy5wdXNoKG1vdmllLlRpdGxlKVxuXG4gICAgICAgIGxpc3QuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCBUbXBsLm9wdGlvbihtb3ZpZS5UaXRsZSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHVsLmlubmVySFRNTCA9IGh0bWwuam9pbignJylcbiAgICByZXR1cm4gcmVzdWx0c1xuICB9XG5cbmZ1bmN0aW9uIEZldGNoKG1vZGVsLCAuLi5hcmdzKSB7XG4gICAgY29uc3QgcmVzdWx0cyA9ICQoJ3Jlc3VsdHMnKTtcbiAgICByZXN1bHRzLmNsYXNzTGlzdC5hZGQoJ3NwaW4nKTtcblxuICAgIG1vZGVsLmZldGNoKC4uLmFyZ3MpXG4gICAgICAgICAgLnRoZW4ocmVuZGVyKVxuICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQocmVzdWx0cy5jbGFzc0xpc3QucmVtb3ZlLmJpbmQocmVzdWx0cy5jbGFzc0xpc3QpLCAxMDAwLCAnc3BpbicpO1xuICAgICAgICAgIH0pXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgIHJlc3VsdHMuaW5uZXJIVE1MID0gJ09vcHMuLi4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJ1xuICAgICAgICAgICAgICByZXN1bHRzLmNsYXNzTGlzdC5yZW1vdmUoJ3NwaW4nKTtcbiAgICAgICAgICAgIH0pO1xuICB9XG5cblxuY29uc3Qgb25DaGFuZ2UgPSBlID0+IGUudGFyZ2V0Lm1hdGNoZXMoJyNzZWFyY2gnKSAmJiBGZXRjaChNb2RlbC5yZXNldCgpLCBlLnRhcmdldC52YWx1ZSk7XG5jb25zdCBvbkNsaWNrID0gZSA9PiB7XG5cbiAgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJyNuZXh0JykpXG4gICAgRmV0Y2goTW9kZWwubmV4dCgpKVxuXG4gIGVsc2UgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJyNwcmV2JykpXG4gICAgRmV0Y2goTW9kZWwucHJldigpKVxuXG4gIGVsc2UgaWYgKGUudGFyZ2V0Lm1hdGNoZXMoJyNjbG9zZScpKVxuICAgIGUudGFyZ2V0LnBhcmVudEVsZW1lbnQucmVtb3ZlKClcblxuICBlbHNlIGlmIChlLnRhcmdldC5tYXRjaGVzKCcuaW1nJykpXG4gICAgTW9kZWwuZGV0YWlscyhlLnRhcmdldC5pZClcbiAgICAgIC50aGVuKG1vdmllID0+IHtcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVFbmQnLCBUbXBsLmRldGFpbHMobW92aWUpKTtcbiAgICAgICAgICB9KTtcbn1cblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbml0KGVsKSB7XG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpXG4gIGVsLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIG9uQ2hhbmdlLCBmYWxzZSlcbn0iLCIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHRvdGFsID0gU3ltYm9sKCd0b3RhbCcpO1xuY29uc3QgbGltaXQgPSBTeW1ib2woJ2xpbWl0Jyk7XG5jb25zdCBjdXJyZW50ID0gU3ltYm9sKCdjdXJyZW50Jyk7XG5jb25zdCBpc0ludCA9IHggPT4geCA9PT0gKDAgfCB4KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIFsgVVJMIF06ICdodHRwOi8vd3d3Lm9tZGJhcGkuY29tLycsXG4gIFsgVVJMIF06ICdodHRwOi8vbG9jYWxob3N0OjMwMDAvJyxcbiAgWyB0b3RhbCBdOiAwLFxuICBbIGxpbWl0IF06IDEwLFxuICBbIGN1cnJlbnQgXTogMCxcblxuICByZXN1bHRzOiBbXSxcbiAgc2VhcmNoOiAnQ293Ym95IEJlYm9wJyxcblxuICBmZXRjaChzZWFyY2gpIHtcbiAgICBpZiAoJ3N0cmluZyc9PT10eXBlb2Ygc2VhcmNoKVxuICAgICAgdGhpcy5zZWFyY2ggPSBzZWFyY2hcblxuICAgIHJldHVybiBmZXRjaChgJHsgdGhpc1sgVVJMIF0gfT9zPSR7IGVuY29kZVVSSUNvbXBvbmVudCh0aGlzLnNlYXJjaCkgfSZwYWdlPSR7IHRoaXMucGFnZSB9YClcbiAgICAgICAgICAgICAgLnRoZW4oeCA9PiB4Lmpzb24oKSlcbiAgICAgICAgICAgICAgLnRoZW4oeCA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3RhbCA9ICt4LnRvdGFsUmVzdWx0c1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlc3VsdHMgPSB4LlNlYXJjaFxuICAgICAgICAgICAgICB9KVxuICAgIH0sXG5cbiAgZGV0YWlscyhpZCkge1xuICAgICAgcmV0dXJuIGZldGNoKGAkeyB0aGlzWyBVUkwgXSB9P2k9JHsgaWQgfSZwbG90PWZ1bGxgKVxuICAgICAgICAgICAgICAudGhlbih4ID0+IHguanNvbigpKVxuICAgIH0sXG5cbiAgZ2V0IHRvdGFsKCkge1xuICAgICAgcmV0dXJuIHRoaXNbIHRvdGFsIF07XG4gICAgfSxcbiAgc2V0IHRvdGFsKG4pICAge1xuICAgICAgaWYgKGlzSW50KG4pICYmIG4gPiAtMSlcbiAgICAgICAgdGhpc1sgdG90YWwgXSA9IG47XG4gICAgfSxcblxuICBnZXQgbGltaXQoKSB7XG4gICAgICByZXR1cm4gdGhpc1sgbGltaXQgXTtcbiAgICB9LFxuICBzZXQgbGltaXQobikgICB7XG4gICAgICBpZiAoaXNJbnQobikgJiYgbiA+IDApXG4gICAgICAgIHRoaXNbIGxpbWl0IF0gPSBuO1xuICAgIH0sXG5cbiAgZ2V0IGN1cnJlbnQoKSB7XG4gICAgICByZXR1cm4gdGhpc1sgY3VycmVudCBdO1xuICAgIH0sXG4gIHNldCBjdXJyZW50KG4pIHtcbiAgICAgIGlmIChpc0ludChuKVxuICAgICAgICAmJiBuID49IDBcbiAgICAgICAgJiYgbiA8PSB0aGlzLnRvdGFsKVxuICAgICAgICB0aGlzWyBjdXJyZW50IF0gPSBuO1xuICAgIH0sXG5cbiAgZ2V0IHBhZ2UoKSB7XG4gICAgICByZXR1cm4gMSArICgwfHRoaXMuY3VycmVudC90aGlzLmxpbWl0KTtcbiAgICB9LFxuXG4gIG5leHQoKSB7XG4gICAgICB0aGlzLmN1cnJlbnQgKz0gdGhpcy5saW1pdDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH0sXG5cbiAgcHJldigpIHtcbiAgICAgIHRoaXMuY3VycmVudCAtPSB0aGlzLmxpbWl0O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSxcblxuICByZXNldCgpIHtcbiAgICAgIHRoaXMudG90YWwgPSAwO1xuICAgICAgdGhpcy5saW1pdCA9IDEwO1xuICAgICAgdGhpcy5jdXJyZW50ID0gMDtcbiAgICAgIHRoaXMucmVzdWx0cyA9IFtdO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiY29uc3Qga2V5cyA9ICdUaXRsZSxBd2FyZHMsQWN0b3JzLFdyaXRlcixHZW5yZSxSdW50aW1lLERpcmVjdG9yLFJlbGVhc2VkLGltZGJSYXRpbmcnLnNwbGl0KCcsJylcblxuZXhwb3J0cy5kZXRhaWxzID0gbW92aWUgPT4gYFxuICAgICAgPGRpdiBpZD1wb3B1cD5cbiAgICAgICAgPGJ1dHRvbiBpZD1jbG9zZT7inJY8L2J1dHRvbj5cbiAgICAgICAgPGltZyBzcmM9XCIkeyBtb3ZpZS5Qb3N0ZXIgfVwiPlxuICAgICAgICA8ZGw+XG4gICAgICAgICAgJHsga2V5cy5tYXAoa2V5ID0+IGA8ZHQ+JHsga2V5IH08L2R0PjxkZD4keyBtb3ZpZVsga2V5IF0gfTwvZGQ+YCkuam9pbignJykgfVxuICAgICAgICA8L2RsPlxuICAgICAgICA8cD4keyBtb3ZpZS5QbG90IH08L3A+XG4gICAgICA8L2Rpdj5gXG5cbmV4cG9ydHMubW92aWUgPSAoeyBUaXRsZSwgWWVhciwgaW1kYklELCBUeXBlLCBQb3N0ZXIgfSkgPT4gYFxuICAgIDxsaT5cbiAgICAgIDxkaXYgaWQ9JHsgaW1kYklEIH0gY2xhc3M9aW1nICR7IFBvc3Rlcj09PSduL2EnID8gJycgOiBgc3R5bGU9XCJiYWNrZ3JvdW5kLWltYWdlOiB1cmwoJHsgUG9zdGVyIH0pO1wiYCB9PjwvZGl2PlxuICAgICAgPGgzPiR7IFRpdGxlIH08L2gzPlxuICAgICAgPGk+eWVhcjogJHsgWWVhciB9PC9pPlxuICAgICAgPGk+dHlwZTogJHsgVHlwZSB9PC9pPlxuICAgIDwvbGk+YFxuXG5leHBvcnRzLm9wdGlvbiA9IHZhbHVlID0+IGA8b3B0aW9uIHZhbHVlPVwiJHsgdmFsdWUgfVwiPmAiXX0=
