var defaults = require('lodash/defaults');
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

function parse(config, styles, level) {
  level = level === undefined ? 0 : level;

  var pretty = config.pretty;
  var css = '';

  for (var styleName in styles) {
    if (!styles.hasOwnProperty(styleName)) {
      continue;
    }

    // Extract the style definition or nested block.
    var styleValue = styles[styleName];

    if (styleValue === null) {
      continue;
    }

    // Remove whitespace from selector/block.
    styleName = styleName.trim();

    var block = Object.prototype.toString.call(styleValue) === '[object Object]';

    if (block) {
      css += indent(pretty, level) + styleName + space(pretty) + '{' + line(pretty);
      css += parse(config, styleValue, level + 1);
      css += indent(pretty, level) + '}' + line(pretty) + line(pretty);
      continue;
    }

    css += indent(pretty, level + 1) + hyphenateStyleName(styleName) + ':' + space(pretty);
    css += dangerousStyleValue(styleName, styleValue) + ';' + line(pretty);
  }

  return css;
}

module.exports = function(content) {
  this.cacheable();

  config = defaults(loaderUtils.getLoaderConfig(this, 'jsCssLoader'), {pretty: process.env.NODE_ENV !== 'production'});

  var styles = this.exec(content, this.resourcePath);

  return parse(config, styles.__esModule ? styles.default : styles);
};
