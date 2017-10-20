/* eslint-disable guard-for-in */

var getLocalIdent = require('css-loader/lib/getLocalIdent');

module.exports = function(context, localIdentName, module) {
  for (var key in module.exports) {
    module.exports[key] = getLocalIdent(
      {resourcePath: module.filename},
      localIdentName,
      key,
      {context: context, hashPrefix: ''}
    );
  }
};
