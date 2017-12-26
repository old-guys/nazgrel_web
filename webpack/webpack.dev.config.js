import Config, { environment } from 'webpack-config';
import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import uuidv1 from 'uuid/v1';

const uuid = uuidv1();
const extractCSS = new ExtractTextPlugin('[name].fonts.css');
const extractSCSS = new ExtractTextPlugin('[name].styles.css');
const platformConfig = require(path.resolve(`./config/${environment.getOrDefault('platform')}.config`));

module.exports = (env = {}) => {
  return {
    entry: {
      index: './src/index.js',
      vendor: ['react', 'react-dom', 'react-router-dom', 'react-redux', 'redux', 'redux-thunk', 'reactstrap']
    },
    output: {
      filename: `[name].${uuid}.js`,
      chunkFilename: `[name].${uuid}.js`,
      path: path.resolve(`./www${platformConfig.buildPath}`),
      publicPath: platformConfig.publicPath
    },
    devtool: env.prod ? 'source-map' : 'cheap-module-eval-source-map',
    devServer: {
      contentBase: path.resolve(`./www${platformConfig.buildPath}`),
      port: 9001,
      compress: true,
      hot: true,
      open: true
    },
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
          test: /\.html$/,
          loader: 'html-loader',
          exclude: [
            path.resolve('./src/index.html'),
          ],
        },
        {
          test: /\.(scss)$/,
          use: ['css-hot-loader'].concat(extractSCSS.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  // alias: {'../img': '../public/img' }
                }
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
      new webpack.HotModuleReplacementPlugin(),
      new webpack.optimize.UglifyJsPlugin({sourceMap: true}),
      new webpack.NamedModulesPlugin(),
      extractCSS,
      extractSCSS,
      new HtmlWebpackPlugin({
        ENV: platformConfig,
        template: path.resolve('./src/index.html'),
        newrelicJsPath: `/vendor/newrelic.${uuid}.js`,
        pleaseWaitJsPath: `/vendor/please-wait.${uuid}.js`,
        pleaseWaitCssPath: `/vendor/please-wait.${uuid}.css`
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('development'),
        'process.platformConfig': JSON.stringify(platformConfig),
        PRODUCTION: JSON.stringify(false),
      }),
      new CopyWebpackPlugin(
        [
          { from: './assets/images', to: './images/' },
          { from: "./vendor/javascripts", to: `./vendor/[name].${uuid}.[ext]` },
          { from: "./node_modules/please-wait/build/please-wait.js", to: `./vendor/[name].${uuid}.[ext]` },
          { from: "./vendor/stylesheets/please-wait.css", to: `./vendor/[name].${uuid}.[ext]` },
        ],
        { copyUnmodified: false }
      )
    ]
  }
};
