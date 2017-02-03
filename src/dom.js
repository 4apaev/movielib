'use strict';
const { defineProperty, getOwnPropertyDescriptor } = Object;

function define(Ctor, name, value) {
    return defineProperty(Ctor.prototype, name, {
        value,
        configurable: true,
        writable: true
      });
  }
function defineGetter(Ctor, name, get, set) {
    return defineProperty(Ctor.prototype, name, {
        get,
        set,
        configurable: true
      });
  }
function defineAlias(Src, name, alias=name, Trg=Src) {
    const desc = getOwnPropertyDescriptor(Src.prototype, name);
    return desc && defineProperty(Trg.prototype, alias, desc);
  }

/////////////////////////////////////////////////////////////////////////////////////////////

function empty() {
    let first;
    while (first = this.firstChild);
      this.removeChild(first);
    return this;
  }
function insert(x, position='beforeEnd') {
    this[ x instanceof Element ? 'insertAdjacentElement' : 'insertAdjacentHTML' ](position, x);
    return this;
  }
function append(x) {
    return this.insert(x, 'beforeEnd');
  }
function prepend(x) {
    return this.insert(x, 'afterBegin');
  }
function after(x) {
    return this.insert(x, 'afterEnd');
  }
function before(x) {
    return this.insert(x, 'beforeBegin');
  }
function query(x) {
    return [ ...this.querySelectorAll(x) ];
  }

/////////////////////////////////////////////////////////////////////////////////////////////

defineAlias(Node, 'textContent', 'text');
defineAlias(Node, 'parentElement', 'parent');

defineAlias(EventTarget, 'addEventListener', 'on');
defineAlias(EventTarget, 'removeEventListener', 'off');

defineAlias(Element,  'nextElementSibling'     , 'next');
defineAlias(Element,  'previousElementSibling' , 'prev');
defineAlias(Element,  'lastElementChild'       , 'last');
defineAlias(Element,  'firstElementChild'      , 'first');
defineAlias(Element,  'querySelector'          , 'find');

define(Element, 'query'   , query);
define(Element, 'insert'  , insert);
define(Element, 'append'  , append);
define(Element, 'prepend' , prepend);
define(Element, 'after'   , after);
define(Element, 'before'  , before);
define(Element, 'empty'   , empty);

defineGetter(Element, 'html', function get() {
    return this.innerHTML
  }, function set(html) {
        return this.innerHTML = html
        // return this.empty().append(html)
      });


