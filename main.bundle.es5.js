"use strict";

function _defineEnumerableProperties(obj, descs) { for (var key in descs) { var desc = descs[key]; desc.configurable = desc.enumerable = true; if ("value" in desc) desc.writable = true; Object.defineProperty(obj, key, desc); } return obj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    var init = require('./src/index');

    document.addEventListener('DOMContentLoaded', function ready() {
      init(document.body);
      document.removeEventListener('DOMContentLoaded', ready);
    });
  }, { "./src/index": 2 }], 2: [function (require, module, exports) {
    'use strict';

    var $ = document.getElementById.bind(document);
    var Tmpl = require('./templates');
    var Model = require('./model');
    var titles = [];

    function render(results) {
      var n = results.length,
          html = Array(n),
          list = $('movies'),
          ul = $('results');

      for (var movie, i = 0; i < n; i++) {
        html[i] = Tmpl.movie(movie = results[i]);

        if (titles.indexOf(movie.Title) === -1) {
          titles.push(movie.Title);

          list.insertAdjacentHTML('beforeEnd', Tmpl.option(movie.Title));
        }
      }

      ul.innerHTML = html.join('');
      return results;
    }

    function Fetch(model) {
      var results = $('results');
      results.classList.add('spin');

      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      model.fetch.apply(model, args).then(render).then(function () {
        setTimeout(results.classList.remove.bind(results.classList), 1000, 'spin');
      }).catch(function (err) {
        results.innerHTML = 'Oops... Something went wrong.';
        results.classList.remove('spin');
      });
    }

    var onChange = function onChange(e) {
      return e.target.matches('#search') && Fetch(Model.reset(), e.target.value);
    };
    var onClick = function onClick(e) {

      if (e.target.matches('#next')) Fetch(Model.next());else if (e.target.matches('#prev')) Fetch(Model.prev());else if (e.target.matches('#close')) e.target.parentElement.remove();else if (e.target.matches('.img')) Model.details(e.target.id).then(function (movie) {
        document.body.insertAdjacentHTML('beforeEnd', Tmpl.details(movie));
      });
    };

    module.exports = function init(el) {
      el.addEventListener('click', onClick, false);
      el.addEventListener('change', onChange, false);
    };
  }, { "./model": 3, "./templates": 4 }], 3: [function (require, module, exports) {
    'use strict';

    var _total, _total2, _limit, _limit2, _current, _current2, _page, _module$exports, _mutatorMap;

    var total = Symbol('total');
    var limit = Symbol('limit');
    var current = Symbol('current');
    var isInt = function isInt(x) {
      return x === (0 | x);
    };

    module.exports = (_module$exports = {}, _defineProperty(_module$exports, URL, 'http://localhost:3000/'), _defineProperty(_module$exports, total, 0), _defineProperty(_module$exports, limit, 10), _defineProperty(_module$exports, current, 0), _defineProperty(_module$exports, "results", []), _defineProperty(_module$exports, "search", 'Cowboy Bebop'), _defineProperty(_module$exports, "fetch", function (_fetch) {
      function fetch(_x) {
        return _fetch.apply(this, arguments);
      }

      fetch.toString = function () {
        return _fetch.toString();
      };

      return fetch;
    }(function (search) {
      var _this = this;

      if ('string' === typeof search) this.search = search;

      return fetch(this[URL] + "?s=" + encodeURIComponent(this.search) + "&page=" + this.page).then(function (x) {
        return x.json();
      }).then(function (x) {
        _this.total = +x.totalResults;
        return _this.results = x.Search;
      });
    })), _defineProperty(_module$exports, "details", function details(id) {
      return fetch(this[URL] + "?i=" + id + "&plot=full").then(function (x) {
        return x.json();
      });
    }), _total = "total", _mutatorMap = {}, _mutatorMap[_total] = _mutatorMap[_total] || {}, _mutatorMap[_total].get = function () {
      return this[total];
    }, _total2 = "total", _mutatorMap[_total2] = _mutatorMap[_total2] || {}, _mutatorMap[_total2].set = function (n) {
      if (isInt(n) && n > -1) this[total] = n;
    }, _limit = "limit", _mutatorMap[_limit] = _mutatorMap[_limit] || {}, _mutatorMap[_limit].get = function () {
      return this[limit];
    }, _limit2 = "limit", _mutatorMap[_limit2] = _mutatorMap[_limit2] || {}, _mutatorMap[_limit2].set = function (n) {
      if (isInt(n) && n > 0) this[limit] = n;
    }, _current = "current", _mutatorMap[_current] = _mutatorMap[_current] || {}, _mutatorMap[_current].get = function () {
      return this[current];
    }, _current2 = "current", _mutatorMap[_current2] = _mutatorMap[_current2] || {}, _mutatorMap[_current2].set = function (n) {
      if (isInt(n) && n >= 0 && n <= this.total) this[current] = n;
    }, _page = "page", _mutatorMap[_page] = _mutatorMap[_page] || {}, _mutatorMap[_page].get = function () {
      return 1 + (0 | this.current / this.limit);
    }, _defineProperty(_module$exports, "next", function next() {
      this.current += this.limit;
      return this;
    }), _defineProperty(_module$exports, "prev", function prev() {
      this.current -= this.limit;
      return this;
    }), _defineProperty(_module$exports, "reset", function reset() {
      this.total = 0;
      this.limit = 10;
      this.current = 0;
      this.results = [];
      return this;
    }), _defineEnumerableProperties(_module$exports, _mutatorMap), _module$exports);
  }, {}], 4: [function (require, module, exports) {
    var keys = 'Title,Awards,Actors,Writer,Genre,Runtime,Director,Released,imdbRating'.split(',');

    exports.details = function (movie) {
      return "\n      <div id=popup>\n        <button id=close>✖</button>\n        <img src=\"" + movie.Poster + "\">\n        <dl>\n          " + keys.map(function (key) {
        return "<dt>" + key + "</dt><dd>" + movie[key] + "</dd>";
      }).join('') + "\n        </dl>\n        <p>" + movie.Plot + "</p>\n      </div>";
    };

    exports.movie = function (_ref) {
      var Title = _ref.Title;
      var Year = _ref.Year;
      var imdbID = _ref.imdbID;
      var Type = _ref.Type;
      var Poster = _ref.Poster;
      return "\n    <li>\n      <div id=" + imdbID + " class=img " + (Poster === 'n/a' ? '' : "style=\"background-image: url(" + Poster + ");\"") + "></div>\n      <h3>" + Title + "</h3>\n      <i>year: " + Year + "</i>\n      <i>type: " + Type + "</i>\n    </li>";
    };

    exports.option = function (value) {
      return "<option value=\"" + value + "\">";
    };
  }, {}] }, {}, [1]);
