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
      test: /\.css\.js$/,
      loader: 'css-js-loader',
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
    }],
  },
};

const compile = () => {
  return new Promise((resolve) => {
    _webpack(config, (err, stats) => {
      // console.log(err); // eslint-disable-line no-console
      expect(err).to.be.null;
      resolve(stats);
    });
  });
  // const compiler = _webpack(config);

  // compiler.outputFileSystem = new MemoryFileSystem();
  // return new Promise((resolve) => {
  //   compiler.run((err, _stats) => {
  //     expect(err).to.be.null;
  //     const stats = _stats.toJson();
  //     const files = {};
  //     stats.assets.forEach((asset) => {
  //       files[asset.name] = compiler.outputFileSystem.readFileSync(
  //         path.join(config.output.path, asset.name)
  //       );
  //     });
  //     console.log(stats); // eslint-disable-line no-console
  //     resolve((stats, files));
  //   });
  // });
};

describe('css-js-loader test', function() {
  it('should split files when needed', () =>
    compile().then((stats) => {
      console.log(stats.compilation); // eslint-disable-line no-console
      if (stats.hasErrors()) {
        console.log(stats.compilation.errors[0]); // eslint-disable-line no-console
        // done(stats.compilation.errors[0]);
        return;
      }
      // console.log('got here at least', stats.stats.compilation); // eslint-disable-line no-console
    })
  );
  it('should check that this test file is run', function() {
    expect(null).to.be.null;
  });
});
