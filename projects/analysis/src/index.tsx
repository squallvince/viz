/*
 * @Author: Squall Sha
 * @Date: 2019-12-19 11:09:03
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-23 15:43:08
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'connected-react-router';
import routes from './routes';
import configureStore, { history } from 'store';
import { ConfigProvider } from 'antd'; // 引入ConfigProvider全局化配置
import zhCN from 'antd/es/locale/zh_CN';
import 'less/index.less';

const store = configureStore();

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <div className='theme-dark'>{renderRoutes(routes)}</div>
      </ConnectedRouter>
    </Provider>
  </ConfigProvider>,
  document.getElementById('root')
);
