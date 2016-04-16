var webpack = require('karma-webpack');
var paths = require('./paths');
var path = require('path');

module.exports = function (config) {
  config.set({
    frameworks: ['chai', 'mocha'],
    files: [
      '../test/tests.bundle.js'
    ],
    plugins: [
      webpack,
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-coverage',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      '../src/**/*.js': ['webpack', 'sourcemap'],
      '../src/**/*.spec.js': ['webpack', 'sourcemap'],
      '../test/**/*.spec.js': ['webpack', 'sourcemap'],
      '../test/tests.bundle.js': ['webpack'],
    },
    webpack: {
      module: {
        loaders: [{
          test: /\.(js|jsx)$/, exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          loader: 'css?sass',
          exclude: /node_modules/
        }],
        postLoaders: [{
          test: /\.js$/,
          exclude: /(spec\.js|node_modules\/|test\/)/,
          loader: 'istanbul-instrumenter'
        }]
      },
      resolve: {
        extensions: ['', '.js', '.scss'],
        alias: paths
      }
    },
    webpackMiddleware: { noInfo: true },

    reporters: ['mocha', 'coverage'],

    mochaReporter: {
      output: 'minimal'
    },

    coverageReporter: {
      type: 'lcovonly',
      subdir: '.',
      dir: '../dist',
      file: 'lcov.info'
    }
  });
};
