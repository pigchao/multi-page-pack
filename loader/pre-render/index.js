//babel ./loader/pre-render/es6 --out-dir ./loader/pre-render/es5
if (parseInt(process.versions.node.split('.')[0]) >= 8) {
  // Native (Node 8+) ES6. (Requires async / await.)
  module.exports = require('./es6/index.js')
} else {
  // Transpiled through babel to target Node 4+.
  module.exports = require('./es5/index.js')
}
