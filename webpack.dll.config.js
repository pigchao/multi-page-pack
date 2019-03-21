const path = require('path');
const webpack = require('webpack');
const CleanPlugin = require('clean-webpack-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, './lib'),
    filename: '[name].[chunkhash].js',
    library: '[name]_[chunkhash]',
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.js'
    }
  },
  entry: {
    'jquery': ['jquery'],
    'vue': ['vue'],
    'react': ['react', 'react-dom', 'core-js/es6/map', 'core-js/es6/set']
  },
  mode: 'production',
  plugins: [
    new CleanPlugin(['./lib/*']),
    new webpack.DllPlugin({
      context: __dirname,
      name: '[name]_[chunkhash]',
      path: path.join(__dirname, 'lib', '[name]-manifest.json'),
    }),
  ],
};
