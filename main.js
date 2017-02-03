const init = require('./src/index')

document.addEventListener('DOMContentLoaded', function ready() {
  init(document.body);
  document.removeEventListener('DOMContentLoaded', ready);
})


