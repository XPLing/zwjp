'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const merge = require('webpack-merge');
function getEntry(globPath) {
  var entries = {},
    basename;

  glob.sync(globPath).forEach(function (entry) {

    basename = path.basename(entry, path.extname(entry));
    entries[basename] = entry;
  });
  return entries;
}

function getEntry2(globPath, noFolder) {
  var entries = {},
    filesname, filesPath, entryName;
    glob.sync(globPath).forEach(function (entry) {
    filesname = path.basename(entry, path.extname(entry));
    if (noFolder) {
      filesPath = path.dirname(entry).replace('./src/view/', '');
    } else {
      filesPath = path.dirname(entry).replace('./src/', '');
    }
    entryName = filesPath + '/' + filesname;
    entries[entryName] = entry;

  });
  return entries;
}
exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

//获取所有入口文件(不带目录结构)
exports.getEntry = getEntry;
//获取所有入口文件(带目录结构)
exports.getEntry2 = getEntry2;
exports.htmlPlugins = function () {
  var pages = getEntry2('./src/view/**/*.html');
  var arr = [];
  for (var pathname in pages) {
    // 配置生成的html文件，定义路径等
    let chunks = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production-dev' ? ['manifest','common','vendor',pathname.replace(/^view\//, '')] : [pathname.replace(/^view\//, '')];
    var conf = {
      filename: pathname + '.html',
      template: pages[pathname], // 模板路径
      inject: true, // js插入位置
      chunks: chunks,
      chunksSortMode: 'manual' //手动
    };
    var path = pages[pathname];
    if (/index.html/.test(path)) {
      conf.filename = 'index.html';
    }
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production-dev') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: process.env.NODE_ENV === 'production',
          removeAttributeQuotes: false // 移除属性的引号
        }
      });
    }
    arr.push(new HtmlWebpackPlugin(conf));
  }
  return arr;
};
