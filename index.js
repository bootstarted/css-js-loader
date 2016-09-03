var defaults = require('lodash/defaults');
var mapKeys = require('lodash/mapKeys');
var isArray = require('lodash/isArray');
var omit = require('lodash/omit');
var isString = require('lodash/isString');
var isNumber = require('lodash/isNumber');
var loaderUtils = require('loader-utils');
var dangerousStyleValue = require('react/lib/dangerousStyleValue');
var hyphenateStyleName = require('fbjs/lib/hyphenateStyleName');

function indent(pretty, depth) {
  return pretty ? Array(depth).join('  ') : '';
};

function space(pretty) {
  return pretty ? ' ' : '';
};

function line(pretty) {
  return pretty ? '\n' : '';
}

function isProp(value) {
  return isArray(value) ?
    isProp(value[0], true) :
    isString(value) || isNumber(value);
}

function format(config, value, name, level, inProp) {
  level = level !== undefined ? level : 0;

  var pretty = config.pretty;
  var css = '';
  var indentLevel = level;

  if (isArray(value)) {
    for (var i = 0, len = value.length; i < len; i ++) {
      css += format(config, value[i], name, level, inProp);
    }
    return css;
  }

  if (inProp) {
    // The `name` and `value` args currently represent a css property and value.
    // Use React's css style processing funcs to generate css markup.

    css += indent(pretty, indentLevel) + hyphenateStyleName(name) + ':' + space(pretty);
    css += dangerousStyleValue(name, value) + ';' + line(pretty);
  } else {
    // The `name` and `value` args currently represent a block containing css
    // properties or further nested blocks. Iterate through and parse
    // the nested values.

    if (name) {
      // Unless we are in the global css scope (`name` is undefined), add a new
      // block to the markup.
      css += indent(pretty, indentLevel) + name + space(pretty) + '{' + line(pretty);
      indentLevel += 1;
    }

    for (var key in value) {
      if (!value.hasOwnProperty(key)) {
        continue;
      }

      // Extract the style definition or nested block.
      var innerValue = value[key];

      if (innerValue === null) {
        continue;
      }

      // Determine if the inner value is a block or a property.
      var innerIsProp = isProp(innerValue);

      // Remove whitespace from selector/block/property.
      var innerName = key.trim();

      css += format(config, innerValue, innerName, level + 1, innerIsProp);
    }

    if (name) {
      // Close the open block.
      css += indent(pretty, level) + '}' + line(pretty) + line(pretty);
    }
  }

  return css;
}

module.exports = function(content) {
  this.cacheable();

  config = defaults(
    loaderUtils.getLoaderConfig(this, 'jsCssLoader'),
    {pretty: process.env.NODE_ENV !== 'production'}
  );

  var styles = this.exec(content, this.resourcePath);

  var css = '';

  if (styles.__esModule) {
    // When using Babel, css classes can be defined as named es6 exports.
    //
    // e.x.
    //
    // ```
    // export default {
    //   '.base': {
    //     color: 'black'
    //   }
    // };
    // ```
    //
    // is the same as
    //
    // ```
    // export const base = {
    //   color: 'black'
    // };
    // ```
    return format(config, [
      mapKeys(
        omit(styles, 'default'),
        function (value, key) {
          return '.' + key;
        }
      ),
      styles.default,
    ]);
  }

  return format(config, styles);
};
