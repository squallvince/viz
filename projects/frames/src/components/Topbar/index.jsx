/*
 * @Author: Squall Sha
 * @Date: 2020-02-26 16:03:30
 * @Last Modified by: Squall Sha
 * @Last Modified time: 2020-10-29 14:53:44
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Avatar } from 'antd';
import {
  SettingFilled
} from '@ant-design/icons';

const Topbar = props => {
  const { className, userName } = props;

  return (
    <div className={clsx('top-bar', className)}>
      <SettingFilled className="control-list-icon" /> 配置
      <Avatar shape="circle" icon="user" /> {userName}
    </div>
  );
};

Topbar.propTypes = {
  className: PropTypes.string
};

export default Topbar;
