'use strict';

const { NODE_ENV } = process.env;
const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const production = NODE_ENV === 'production';
const BUILD_DIR = path.resolve(__dirname, './dist');

const config = {
  mode: production ? 'production' : 'development',
  target: ['web', 'es5'],
  entry: {
    widget: ['./src/js/app.js']
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].js',
    chunkFilename: '[id].[contenthash].bundle.js',
    publicPath: '/'
  },
  module: {
    rules: [
      { test: /\.(js)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.scss$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'] },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: 'css/[name].css' }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        DEBUG: process.env.DEBUG,
      },
    }),
  ],
  'resolve': {
    fallback: { fs: false, net: false, tls: false }
  },
};

if (production) {
  config.plugins = config.plugins.concat([
    // This plugin prevents Webpack from creating chunks
    // that would be too small to be worth loading separately
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200, // ~50kb
    }),
  ]);
}

module.exports = config;
