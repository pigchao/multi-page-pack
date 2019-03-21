const webpack = require('webpack');
const HappyPack = require('happypack');
const path = require('path');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');

const enableHappyPack = process.env.DISABLE_HAPPYPACK !== 'true';

function buildReactConfigs(){
  return {
    rules: [
      {
        test: /\.(tsx)$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        ...(
          enableHappyPack ?
            {
              use: 'happypack/loader?id=tsx'
            } : {
              loaders: [
                {
                  loader: "babel-loader",
                },
                {
                  loader: 'ts-loader',
                  options: {
                    configFile: path.resolve(__dirname, './tsconfig.json')
                  },
                }
              ],
            }
        )
      }
    ],
    plugins: [
      ...(
        enableHappyPack ?
          [
            new HappyPack({
              id: 'tsx',
              loaders: [
                {
                  loader: "babel-loader",
                },
                {
                  loader: 'ts-loader',
                  options: {
                    configFile: path.resolve(__dirname, './tsconfig.json'),
                    transpileOnly: true,
                    experimentalWatchApi: true,
                    happyPackMode: true,
                  },
                }
              ]
            })
          ] : []
      ),
      new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./lib/react-manifest.json')
      }),
      new AddAssetHtmlPlugin({
        filepath: path.resolve(__dirname, './lib/react*.js'),
        includeSourcemap: false,
      }),
    ]
  }
}

module.exports = buildReactConfigs;
