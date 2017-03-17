const cssJsLoader = require('../');

// Create a sample content passed to cssJsLoader
const style = {
  color: '#eee',
  fontWeight: 'thin',
  fontSize: 24,
  textAlign: 'center',
  padding: 18,
};

// Bind functions to global to replicate `this`
global.cssJsLoader = jest.fn(cssJsLoader);
global.cacheable = jest.fn();
global.exec = jest.fn((x) => x);

// Mock a module
jest.mock('loader-utils', () => {
  return {
    getLoaderConfig: jest.fn(),
  };
});

describe('format works with ', () => {
  it('a javascript style', () => {
    expect(global.cssJsLoader(style)).toMatchSnapshot();
  });

  it('an array of javascript styles', () => {
    expect(global.cssJsLoader([style])).toMatchSnapshot();
  });

  it('es6 objects', () => {
    const sampleObject = {TITLE: style};
    // Make the object pass the es6 check
    Object.defineProperty(sampleObject, '__esModule', {
      value: true,
    });
    expect(global.cssJsLoader(sampleObject)).toMatchSnapshot();
  });

  it('stringified class names', () => {
    const stringedClassName = {
      '.blueText': style,
    };
    expect(global.cssJsLoader(stringedClassName)).toMatchSnapshot();
  });
});
