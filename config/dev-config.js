let devConfig = require('./default-dev-config');
// 添加代理
devConfig.devServer.publicPath = '/';

devConfig.devServer.proxy = [
  {
    context: '/api/',
    target: 'http://10.146.143.59:38080/',
    changeOrigin: true,
    secure: false
  },
  {
    context: '/resource/',
    target: 'http://10.146.143.59:38080/',
    changeOrigin: true,
    secure: false
  }
];

module.exports = devConfig;
