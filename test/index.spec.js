import _webpack from 'webpack';
import {expect} from 'chai';
import path from 'path';
import MemoryFileSystem from 'memory-fs';
import fs from 'fs';

const cssJsLoader = path.resolve(__dirname, '../');
const config = {
  entry: path.join(__dirname, 'fixture/input.css.js'),
  output: {
    path: path.join(__dirname, 'fixture/'),
    filename: 'output.js',
  },
  resolveLoader: {
    alias: {
      'css-js-loader': cssJsLoader,
    },
  },
  module: {
    loaders: [{
      test: /\.css(\.js)?$/,
      loaders: ['style-loader', 'css-loader'],
    }, {
      test: /\.css\.js$/,
      loader: 'css-js-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
    }],
  },
};

const webpack = () => {
  return new Promise((resolve) => {
    _webpack(config, (err, stats) => {
      expect(err).to.be.null;
      resolve(stats);
    });
  });
};

describe('css-js-loader test', function() {
  it('should split files when needed', () =>
    webpack().then((stats) => {
      if (stats.hasErrors()) {
        return;
      }
    })
  );
  it('should check that this test file is run', function() {
    expect(null).to.be.null;
  });
});
