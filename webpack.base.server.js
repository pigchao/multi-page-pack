const webpack = require('webpack');
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');

const baseConfig = {
  entry: {
    'server': path.join(__dirname, 'src/server/server'),
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  target: 'node',
  mode: 'production',
  output: {
    path: path.join(__dirname, 'dist/server'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', 'json', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: [path.resolve(__dirname, "node_modules")],
        loaders: [
          {
            loader: "babel-loader"
          },
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: path.resolve(__dirname, './tsconfig-server.json') },
          }
        ],
      }
    ]
  },
  plugins: [
    new CleanPlugin([`./dist/*`]),
    new webpack.DefinePlugin({
      'process.env': {
        NET_ENV: JSON.stringify(process.env.NET_ENV),
      }
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
  ]
};

module.exports = baseConfig;
