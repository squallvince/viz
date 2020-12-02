/*
 * @Author: Squall Sha
 * @Date: 2019-12-23 11:14:08
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-10-22 11:24:18
 */

import React from "react";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import { ConnectedRouter } from "connected-react-router";
import routes from "./routes";
import configureStore, { history } from "./store";
import { ConfigProvider } from "antd"; // 引入ConfigProvider全局化配置
import zhCN from "antd/es/locale/zh_CN";

const store = configureStore();

class Root extends React.Component {
  render() {
    return (
      <ConfigProvider locale={zhCN}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <div className="theme-dark">{renderRoutes(routes)}</div>
          </ConnectedRouter>
        </Provider>
      </ConfigProvider>
    );
  }
}

export default Root;
