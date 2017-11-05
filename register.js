/* global __WRAPPED__ __CONTEXT__ __IDENT_NAME__ */
var Module = require('module');

function register(context, localIdentName) {
  function f(_, r, m, __filename) {
    var q = __WRAPPED__;
    q.apply(this, arguments);
    if (/\.css\.js$/.exec(__filename)) {
      r('__REWRITE__')(__CONTEXT__, __IDENT_NAME__, m);
    }
  }

  var oldWrap = Module.wrap;
  var body = '(' + f.toString() + ')';
  body = body.replace(/__REWRITE__/, require.resolve('./rewrite'));
  body = body.replace(/__CONTEXT__/, JSON.stringify(context));
  body = body.replace(/__IDENT_NAME__/, JSON.stringify(localIdentName));
  Module.wrap = function webpackPolyfill(content) {
    return body.replace(/__WRAPPED__/, function() {
      return oldWrap(content);
    });
  };
}

module.exports = register;
