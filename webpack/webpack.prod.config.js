import Config, { environment } from 'webpack-config';
import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import uuidv1 from 'uuid/v1';
import fecha from 'fecha';

const date = new Date();
const uuid = `${fecha.format(date, 'YYYYMMDDHHmmss')}${uuidv1().replace(/-/g, '').slice(0, 18)}`;
const extractCSS = new ExtractTextPlugin(`[name].${uuid}.fonts.css`);
const extractSCSS = new ExtractTextPlugin(`[name].${uuid}.styles.css`);
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
    resolve: {
      extensions: ['.js', '.jsx', '.scss', '.css'],
      alias: {
        components: path.resolve('./src/components/'),
        containers: path.resolve('./src/containers/'),
        api: path.resolve('./src/modules/api'),
        reducers: path.resolve('./src/modules/reducers'),
        resources: path.resolve('./src/modules/resources'),
        screens: path.resolve('./src/modules/screens'),
        services: path.resolve('./src/modules/services'),
      }
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
        template: path.resolve('./src/index.html'),
        newrelicJsPath: `/vendor/newrelic.${uuid}.js`,
        pleaseWaitJsPath: `/vendor/please-wait.${uuid}.js`,
        pleaseWaitCssPath: `/vendor/please-wait.${uuid}.css`
      }),
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        'window.$': 'jquery',
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
          { from: "./vendor/javascripts", to: `./vendor/[name].${uuid}.[ext]` },
          { from: "./node_modules/please-wait/build/please-wait.js", to: `./vendor/[name].${uuid}.[ext]` },
          { from: "./vendor/stylesheets/please-wait.css", to: `./vendor/[name].${uuid}.[ext]` },
        ],
        { copyUnmodified: false }
      )
    ]
  }
};
