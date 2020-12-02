/*
 * @Author: Squall Sha
 * @Date: 2019-12-23 11:09:03
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-30 13:59:48
 */

/* eslint-env node */
const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const { getThemeVariables } = require('antd/dist/theme');
const customDark = require('../theme/dark');

const isDev = (process.env.env === 'development');
// 是否单独打包
const isIndependence = (process.env.mode === 'independent');
const project = require('../config/project.json');
// 项目根路径
const ROOT_PATH = path.resolve(__dirname, '../');
// build路径
const BUILD_PATH = isIndependence ? path.resolve(ROOT_PATH, './build') : path.resolve(ROOT_PATH, '../../build/projects', `${project.name}`);

const CONFIG = {
  entry: {
    [project.name]: path.resolve(
      __dirname,
      isIndependence ? '../src/index.tsx' : project.main
    )
  },
  output: {
    filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDev ? '[name].js' : '[name].[contenthash:8].chunk.js',
    library: '[name]',
    libraryTarget: isIndependence ? 'umd' : 'amd',
    path: BUILD_PATH
  },
  mode: 'production',
  module: {
    rules: [
      { parser: { System: false }},
      {
        test: /\.(ts|js)[x]?$/,
        exclude: [path.resolve(ROOT_PATH, 'node_modules')],
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')]
            }
          },
          {
            loader: 'less-loader',
            options: {
              modifyVars: {
                ...getThemeVariables({
                  dark: true, // 开启暗黑模式
                  compact: true // 开启紧凑模式
                }),
                ...customDark
              },
              javascriptEnabled: true,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        exclude: /favicon\.png$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1000,
              name: isDev ? '[name].[ext]' : '[name].[contenthash].[ext]',
              outputPath: 'assets/',
              publicPath: isDev
                ? `//localhost:${project.port}/assets/`
                : `/projects/${project.name}/assets/`
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(ROOT_PATH, 'node_modules')],
    alias: {
      less: path.resolve(ROOT_PATH, 'src/less/'),
      images: path.resolve(ROOT_PATH, 'src/images/'),
      components: path.resolve(ROOT_PATH, 'src/components/'),
      pages: path.resolve(ROOT_PATH, 'src/pages/'),
      routes: path.resolve(ROOT_PATH, 'src/routes/'),
      store: path.resolve(ROOT_PATH, 'src/store/'),
      src: path.resolve(ROOT_PATH, 'src/')
    }
  },
  plugins: [
    new Dotenv({
      systemvars: true
    }),
    new MiniCssExtractPlugin({
      filename: isDev
        ? `${project.name}.css`
        : `${project.name}.[contenthash:8].css`
    }),
    new ManifestPlugin({
      publicPath: `/projects/${project.name}/`,
      basePath: `@portal/${project.name}/`,
      filter: (file) => {
        // 筛选需要通过SystemJS注入的文件
        // file: { path, name, isInitial, isChunk, isAsset, isModuleAsset}
        return file.isChunk && !file.path.endsWith('.map');
      }
    }),
    new CopyWebpackPlugin([
      { from: path.resolve(ROOT_PATH, 'config/project.json'), to: BUILD_PATH }
    ]),
    new webpack.DefinePlugin({
      isIndependence: JSON.stringify(isIndependence)
    })
  ],
  // 根据环境决定source map
  devtool: isDev ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
};

if (isIndependence) {
  CONFIG.plugins.push(
    new HtmlWebpackPlugin({
      title: 'Demo',
      minify: { // 压缩HTML文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true// 压缩内联css
      },
      template: path.resolve(ROOT_PATH, 'template/index.html')
    })
  );
}

module.exports = CONFIG;
