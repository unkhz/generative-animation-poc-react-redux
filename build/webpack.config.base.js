import paths from './paths';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

export const ROOT_PATH = paths.root;
export const APP_PATH = paths.app;
export const CONFIG = {
  entry: `${ APP_PATH }/main`,
  context: APP_PATH,

  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'eslint', exclude: /node_modules/ }
    ],

    loaders: [
      { test: /\.js$/, loader: 'babel', exclude: /node_modules/ },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?minimize!sass'),
        exclude: /node_modules/
      }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.scss'],
    alias: paths
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new HtmlWebpackPlugin({
      template: `${ APP_PATH }/template.html`
    })
  ]
};
