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

describe('css-js-loader:', () => {
  it('Blank style is not modified', () => {
    expect(global.cssJsLoader({})).toMatchSnapshot();
  });

  it('Basic javascript style is converted', () => {
    expect(global.cssJsLoader(style)).toMatchSnapshot();
  });

  it('An array of javascript styles are converted', () => {
    expect(global.cssJsLoader([style])).toMatchSnapshot();
  });

  it('es6 style objects are converted', () => {
    const sampleObject = {TITLE: style};
    // Make the object pass the es6 check
    Object.defineProperty(sampleObject, '__esModule', {
      value: true,
    });
    expect(global.cssJsLoader(sampleObject)).toMatchSnapshot();
  });

  it('Stringified class names are converted', () => {
    const stringedClassName = {
      '.blueText': style,
    };
    expect(global.cssJsLoader(stringedClassName)).toMatchSnapshot();
  });

  it('Style url attributes are maintained', () => {
    const styleWithUrl = {
      'background-image': "url('http://example.com/bg.jpg')",
      ...style,
    };
    expect(global.cssJsLoader(styleWithUrl)).toMatchSnapshot();
  });
});
