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
  resolve: {
    alias: {
        assets: path.join(__dirname, 'src/assets')
    }
  },
  mode: 'development',
  devtool: 'source-map', // For debugging purposes
  module: {
    rules: [
        {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader"
            }
        },
        {
            test: [/\.vert$/, /\.frag$/],
            use: "raw-loader"
        },
        {
            test: /\.(gif|png|jpe?g|svg|xml|glsl)$/i,
            type: "asset/resource"
        },
        {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader']
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/i,
            type: 'asset/resource',
        }
    ]
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