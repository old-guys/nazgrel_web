import Config, { environment } from 'webpack-config';
import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const extractCSS = new ExtractTextPlugin('[name].[hash].fonts.css');
const extractSCSS = new ExtractTextPlugin('[name].[hash].styles.css');
const platformConfig = require(path.resolve(`./config/${environment.getOrDefault('platform')}.config`));

module.exports = (env = {}) => {
  return {
    entry: {
      index: './src/index.js',
      // vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux', 'redux', 'redux-thunk']
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
      path: path.resolve(`./www${platformConfig.buildPath}`),
      publicPath: platformConfig.publicPath
    },
    devtool: 'cheap-module-source-map',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          },
        },
        {
          test: /\.(scss)$/,
          use: ['css-hot-loader'].concat(extractSCSS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
              },
              {
                loader: 'sass-loader'
              }
            ]
          }))
        },
        {
          test: /\.css$/,
          use: extractCSS.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          use: [
            {
              // loader: 'url-loader'
              loader: 'file-loader',
              options: {
                name: './img/[name].[hash].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file-loader',
          options: {
            name: './fonts/[name].[hash].[ext]'
          }
        }
      ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: true
      }),
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'commons',
      //   filename: '[name].[hash].js',
      //   minChunks: 2,
      // }),
      new webpack.NamedModulesPlugin(),
      extractCSS,
      extractSCSS,
      new HtmlWebpackPlugin({
        ENV: platformConfig,
        inject: true,
        template: path.resolve('./src/index.html')
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.platformConfig': JSON.stringify(platformConfig),
        PRODUCTION: JSON.stringify(true),
      }),
      new webpack.optimize.UglifyJsPlugin({
        comments: false
      }),
      new CopyWebpackPlugin(
        [
          { from: './assets/images', to: './images/' },
          { from: "./vendor/javascripts", to: "./vendor/" }
        ],
        { copyUnmodified: false }
      )
    ]
  }
};
