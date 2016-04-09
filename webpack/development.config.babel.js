import { CONFIG, APP_PATH } from './config';
import merge from './helpers/merge';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';

export default merge({
  debug: true,
  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin('bundle.css'),
    new WebpackNotifierPlugin(),
  ],

  devServer: {
    info: true,
    hot: false,
    inline: true,
    stats: {
      colors: true
    },
    port: 9999
  }
}, CONFIG);
