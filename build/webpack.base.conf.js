'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');
const vueLoaderConfig = require('./vue-loader.conf');
var entries = utils.getEntry2('./src/view/**/*.js', true);

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});
module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: entries,
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
    publicPath: /production/.test(process.env.NODE_ENV)
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath,
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.scss', '.json'],
    alias: {
      '@': resolve('src'),
      'api': resolve('src/api'),
      'static': resolve('static'),
      'assets': resolve('src/assets'),
      'js': resolve('src/assets/js'),
      'scss': resolve('src/assets/scss'),
      'components': resolve('src/components'),
      'src': resolve('src'),
      'laydate': resolve('src/components/lib/laydate/laydateChunk.js')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: require.resolve('jquery'),
        use: [
          {
            loader: 'expose-loader?$'
          },
          {
            loader: 'expose-loader?jQuery'
          }
        ]
      },
      {
        test: /\.js$/,
        include: [resolve('src')],
        use: [
          {
            loader: 'imports-loader',
            options: {
              $: 'jquery',
              jQuery: 'jquery'
            }
          }
        ]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /dataTables.*\.js$/,
        include: /node_modules/,
        loader: 'imports-loader?define=>false',
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
