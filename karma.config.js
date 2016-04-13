var webpack = require('karma-webpack');

module.exports = function (config) {
  config.set({
    frameworks: ['chai', 'mocha'],
    files: [
      //'./node_modules/phantomjs-polyfill/bind-polyfill.js',
      'src/**/*.spec.js'
    ],
    plugins: [
      webpack,
      'karma-chrome-launcher',
      'karma-chai',
      'karma-mocha',
      'karma-sourcemap-loader',
      'karma-webpack',
      'karma-phantomjs-launcher'
    ],
    browsers: ['PhantomJS'],
    preprocessors: {
      'src/**/*.spec.js': ['webpack'],
      'src/**/*': ['webpack']
    },
    reporters: ['dots'],
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
