/*
 * @Author: Squall Sha
 * @Date: 2020-10-28 11:26:12
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-30 16:14:20
 */

import React, { useState } from 'react';
import { Layout } from 'antd';
import Header from './header';
import SiderContent from './sider';
import Main from './main';
import 'antd/dist/antd.less';
import '../style/index.less';

const { Sider } = Layout;

export const { Provider, Consumer } = React.createContext('frames');

const transMenuData = (menus) => {
  const currentMenus = [];
  menus.forEach(item => {
    let collapsed = null;
    if (item.attributes.collapsed) {
      collapsed = {
        collapsed: JSON.parse(item.attributes.collapsed)
      };
    }
    const localItem = {
      key: item.attributes.key,
      path: item.attributes.router,
      name: item.attributes.title,
      icon: item.attributes.iconType,
      ...collapsed,
      children: item.children ? transMenuData(item.children) : []
    };
    currentMenus.push(localItem);
  });
  return currentMenus;
};

const BasicLayout = (props) => {
  const { menus } = props;
  const menuData = transMenuData(menus);
  const userInfo = {
    userName: 'Frank'
  };
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = (val) => {
    setCollapsed(val);
  };

  return (
    <Provider value={userInfo}>
      <Layout>
        <Header
          className="header"
          isCollapsed={toggleCollapsed}
        />
        <Layout>
          <Sider className="sider" collapsedWidth={0} trigger={null} collapsible collapsed={collapsed}>
            {menuData.length > 0 && (
              <SiderContent
                isCollapsed={collapsed}
                data={menuData}
                {...props}
              />
            )}
          </Sider>
          <Main className="main" />
        </Layout>
      </Layout>
    </Provider>
  );
};

export default BasicLayout;
