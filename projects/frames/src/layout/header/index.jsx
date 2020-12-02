/*
 * @Author: Squall Sha
 * @Date: 2020-02-21 16:04:55
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-11-10 14:53:15
 */

import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined
} from '@ant-design/icons';
import Logo from '../../components/Logo';
import Topbar from '../../components/Topbar';
import { Consumer } from '../BasicLayout';
import './index.less';

const Header = props => {
  const { className, isCollapsed, userName, ...rest } = props;
  // console.log('header---props', props);

  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
    isCollapsed(!collapsed);
  };

  return (
    <Consumer>
      {(userInfo) => {
        return (
          <header className={clsx('clearfix', className)}>
            <Row {...rest} type="flex">
              <Col span={12}>
                <Button className="btn-collapsed" onClick={toggleCollapsed}>
                  {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
                </Button>
                <Logo
                  collapsed={false}
                  to="/search"
                />
              </Col>
              <Col span={12}>
                <Topbar
                  userName={userInfo.userName}
                />
              </Col>
            </Row>
          </header>
        );
      }}
    </Consumer>
  );
};

Header.propTypes = {
  className: PropTypes.string
};

export default Header;
