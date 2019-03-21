const webpack = require('webpack');
const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

function buildJQueryConfigs(){
  return {
    rules: [
    ],
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery'
      }),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./lib/jquery-manifest.json')
      }),
      new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, './lib/jquery*.js'),
        includeSourcemap: false,
      }),
    ]
  }
}


module.exports = buildJQueryConfigs;
