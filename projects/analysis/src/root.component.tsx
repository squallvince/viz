/*
 * @Author: Squall Sha
 * @Date: 2019-12-23 11:14:08
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-26 14:49:04
 */

import React from 'react';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import { renderRoutes } from 'react-router-config';
import { ConnectedRouter } from 'connected-react-router';
import routes from './routes';
import configureStore, { history } from './store';
import { ConfigProvider } from 'antd'; // 引入ConfigProvider全局化配置
import zhCN from 'antd/es/locale/zh_CN';

const store = configureStore();

class Root extends React.Component {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <RecoilRoot>
              <div className="theme-dark">{renderRoutes(routes)}</div>
            </RecoilRoot>
          </ConnectedRouter>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default Root;
