/*
 * @Author: Squall Sha 
 * @Date: 2019-12-23 16:08:40 
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-26 20:13:49
 */

/* eslint-env node */
const webpack = require('webpack');// 是否单独打包
const config = require('./webpack.common');
const isIndependence = (process.env.mode === 'independent');
config.plugins.push(new webpack.NamedModulesPlugin());
config.plugins.push(new webpack.HotModuleReplacementPlugin());
const project = require('../config/project.json');
config.devServer = {
  historyApiFallback: true,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  proxy: [
    {
      context: `/${project.name}`,
      target: `http://localhost:${project.port}`,
      pathRewrite: {'^/analysis/dashboard': ''},
      changeOrigin: true,
      secure: false
    }
  ]
};

if (isIndependence) {
  Object.assign(config.devServer, {
    host: 'localhost',
    hot: true,
    clientLogLevel: 'info',
    overlay: true,
    compress: true
  });
}

config.mode = 'development';
config.devtool = 'cheap-module-eval-source-map';

module.exports = config;
