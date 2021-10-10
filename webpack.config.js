/* eslint-env node */
'use strict';

const fs = require('fs');
const path = require('path');

const webpack = require('webpack');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const basePath = process.cwd();

const buildDir = 'dist';
const baseOutputPath = path.resolve(basePath, buildDir);

const devConfig = (env) => {

  const config = {};

  config.mode = 'development';
  config.devtool = 'cheap-module-source-map';

  config.entry = './src/index.js'

  config.output = {
    path:     baseOutputPath,
    filename: "bundle.js",
  };

  config.performance = {
    // Stops size hints from being output to the log.
    hints: false,
  };

  config.devServer = {
    hot:      true,
    compress: false,
  }

  config.module = {
    rules: [
      {
        test:    /\.(js|jsx)$/,
        exclude: /node_modules/,
        use:     {
          loader:  'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test:    /\.(css)$/,
        use:     [MiniCssExtractPlugin.loader, { loader: 'css-loader', options: { url: false, sourceMap: env.css } }],
        exclude: /node_modules/,
      },
      {
        test: /\.(less)$/,
        use:  [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false, sourceMap: env.css } },
          { loader: 'less-loader', options: { sourceMap: env.css } },
        ],
      },
    ],
  };

  config.plugins = [
    new MiniCssExtractPlugin(),
  ];

  // Add analyze plugin if required.
  if (env.analyze) {
    config.devtool = false; // toggle this off whan analysing bundles so we can build MUCH faster
    config.plugins.push(new BundleAnalyzerPlugin());
  }

  return config;
};

module.exports = function(env) {
  return devConfig(env);
};
