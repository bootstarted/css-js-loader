# css-js-loader

Write your styles with in JavsScript.

[![build status](http://img.shields.io/travis/10xjs/css-js-loader/master.svg?style=flat)](https://travis-ci.org/10xjs/css-js-loader)
[![coverage](http://img.shields.io/coveralls/10xjs/css-js-loader/master.svg?style=flat)](https://coveralls.io/github/10xjs/css-js-loader?branch=master)
[![license](http://img.shields.io/npm/l/css-js-loader.svg?style=flat)](https://www.npmjs.com/package/css-js-loader)
[![version](http://img.shields.io/npm/v/css-js-loader.svg?style=flat)](https://www.npmjs.com/package/css-js-loader)
[![downloads](http://img.shields.io/npm/dm/css-js-loader.svg?style=flat)](https://www.npmjs.com/package/css-js-loader)

## Usage

Install:

```sh
npm install css-js-loader value-loader
```

Add to your `webpack.config.js`:

```js
module.exports = {
  ...
  module: {
    loaders: [{
      test: /\.css(\.js)?$/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.css\.js$/,
      loaders: ['css-js-loader', 'value-loader'],
    }],
  },
};
```

NOTE: You don't need to chain with [value-loader] per-se, but doing so gives you caching, nested dependency monitoring/reloading and the ability to use webpack's tree-shaking abilities.

## Writing JS Styles

`css-js-loader` converts JS modules to CSS markup at runtime.

A `.css.js` file:

```js
export default {
 '.blueText': {
    color: 'blue',
    fontSize: 12,
  },
};
```

Yields:

```css
.blueText {
  color: blue;
  font-size: 12px;
}
```

CSS classes can be defined as ES6 named exports.

```js
export const blueText = { ... };

export const greenText = { ... };

export default {
  '.redText': { ... },
};
```

Is equivalent to:

```js
export default {
  '.blueText': { ... },
  '.greenText': { ... },
  '.redText' { ... },
};
```

## CSS Modules

`css-js-loader` works great with [CSS Modules]. Named class exports map directly to the class names that are imported in your component files.

Style file:

```js
export const base = { ... };
export const inner = { ... };
```

Component file:

```js
import React from 'react';
import {base, inner} from './component.css.js';
export default () =>
  <div className={base}>
    <div className={inner}>
      ...
    </div>
  </div>;
```

[CSS Modules]: https://github.com/webpack-contrib/css-loader#css-modules
[value-loader]: https://www.npmjs.com/package/value-loader
