/*
 * @Author: Squall Sha
 * @Date: 2020-02-21 16:04:55
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-30 16:14:32
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
// import { Link } from '@reach/router';
import { createFromIconfontCN } from '@ant-design/icons';
import { Menu } from 'antd';
import './index.less';

const { SubMenu } = Menu;

// const menuDataRender = (menuList) => {
//   return menuList.map(item => {
//     const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
//     return localItem;
// });

const onClickMenu = (menu) => {
  window.singleSpaNavigate(`/${menu.key}`);
};

const getOpenKeys = menus => {
  const allOpenKeys = [];
  menus.filter(menu => {
    if(Object.prototype.hasOwnProperty.call(menu, 'collapsed') && !menu.collapsed) {
      allOpenKeys.push(menu.key);
    }
    return Object.prototype.hasOwnProperty.call(menu, 'collapsed') && !menu.collapsed;
  });
  return allOpenKeys;
};

const sider = props => {
  const { data, isCollapsed } = props;
  const [currentOpenKeys, setOpenKeys] = useState(getOpenKeys(data));

  const openSubMenu = openKeys => {
    if (isCollapsed) {
      // 因收缩Sider后hover SubMenu还会触发该事件，因此在此判断当前Sider的收缩状态来return false;
      return false;
    }
    setOpenKeys(openKeys);
  };

  return (
    <Menu
      mode="inline"
      theme="dark"
      defaultSelectedKeys={['index']}
      openKeys={currentOpenKeys}
      onOpenChange={openSubMenu}
      onClick={onClickMenu}
    >
      {
        data.map(menu => {
          if (Object.prototype.hasOwnProperty.call(menu, 'children')) {
            const CurrentIcon = createFromIconfontCN({
              scriptUrl: '//at.alicdn.com/t/font_286280_p0xquimyp3n.js'
            });
            return (
              <SubMenu key={menu.key} title={menu.name} icon={<CurrentIcon type={menu.icon} />}>
                {
                  menu.children.length > 0 && menu.children.map(submenu => {
                    return (
                      <Menu.Item key={submenu.key}>
                        {submenu.name}
                      </Menu.Item>
                    );
                  })
                }
              </SubMenu>
            );
          }
          return (
            <Menu.Item key={menu.key}>
              {menu.name}
            </Menu.Item>
          );
        })
      }
    </Menu>
  );
};

sider.propTypes = {
  className: PropTypes.string
};

export default sider;
