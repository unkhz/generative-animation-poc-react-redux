var webpack = require('karma-webpack');

module.exports = function (config) {
  config.set({
    frameworks: ['chai', 'mocha'],
    files: [
      'test/tests.bundle.js'
    ],
    plugins: [
      webpack,
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher',
      'karma-mocha-reporter',
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      'src/**/*.spec.js': ['webpack', 'sourcemap'],
      'test/**/*.spec.js': ['webpack', 'sourcemap'],
      'test/tests.bundle.js': ['webpack'],
    },
    reporters: ['mocha'],
    mochaReporter: {
      output: 'minimal'
    },
    webpack: {
      module: {
        loaders: [{
          test: /\.(js|jsx)$/, exclude: /(bower_components|node_modules)/,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          loader: 'css?sass',
          exclude: /node_modules/
        }]
      }
    },
    webpackMiddleware: { noInfo: true }
  });
};
