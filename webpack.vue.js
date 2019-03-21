const webpack = require('webpack');
const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');

function buildVueConfigs(){
  return {
    rules: [
      {
        test: /\.vue/,
        loader: "vue-loader",
        options: {
          extractCSS: true,
          postcss: [
            require('postcss-cssnext')(),
            require('postcss-flexbugs-fixes')()
          ],
          loaders: {
            less: 'vue-style-loader!css-loader?-minimize!less-loader'
          }
        }
      }
    ],
    plugins: [
      new VueLoaderPlugin(),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./lib/vue-manifest.json')
      }),
      new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, './lib/vue*.js'),
        includeSourcemap: false,
      }),
    ]
  }
}

module.exports = buildVueConfigs;
