const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  mode: 'development',
  devtool: 'source-map', // For debugging purposes
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets'},
      ],
    }),
    new webpack.HotModuleReplacementPlugin(), // Enable HMR globally
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    hot: true, // Enable HMR on the server
    open: true, //Automatically open the browser
    client: {
      overlay: true, //show overlay on errors
    }
  },
  resolve: {
    extensions: ['.js'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
};